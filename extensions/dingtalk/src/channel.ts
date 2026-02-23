import type { ChannelMeta, ChannelPlugin, OpenClawConfig } from "openclaw/plugin-sdk";
import {
  buildBaseChannelStatusSummary,
  createDefaultChannelRuntimeState,
  DEFAULT_ACCOUNT_ID,
  PAIRING_APPROVED_MESSAGE,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
} from "openclaw/plugin-sdk";
import {
  resolveDingtalkAccount,
  resolveDingtalkCredentials,
  listDingtalkAccountIds,
  resolveDefaultDingtalkAccountId,
} from "./accounts.js";
import {
  listDingtalkDirectoryPeers,
  listDingtalkDirectoryGroups,
  listDingtalkDirectoryPeersLive,
  listDingtalkDirectoryGroupsLive,
} from "./directory.js";
import { dingtalkOnboardingAdapter } from "./onboarding.js";
import { dingtalkOutbound } from "./outbound.js";
import { resolveDingtalkGroupToolPolicy } from "./policy.js";
import { probeDingtalk } from "./probe.js";
import { sendMessageDingtalk } from "./send.js";
import { normalizeDingtalkTarget, looksLikeDingtalkId, formatDingtalkTarget } from "./targets.js";
import type { ResolvedDingtalkAccount, DingtalkConfig } from "./types.js";

const meta: ChannelMeta = {
  id: "dingtalk",
  label: "DingTalk",
  selectionLabel: "DingTalk (钉钉)",
  docsPath: "/channels/dingtalk",
  docsLabel: "dingtalk",
  blurb: "阿里巴巴钉钉企业通讯平台。",
  aliases: ["dt"],
  order: 40,
};

export const dingtalkPlugin: ChannelPlugin<ResolvedDingtalkAccount> = {
  id: "dingtalk",
  meta: {
    ...meta,
  },
  pairing: {
    idLabel: "dingtalkUserId",
    normalizeAllowEntry: (entry) => entry.replace(/^(dingtalk|user|userid):/i, ""),
    notifyApproval: async ({ cfg, id }) => {
      await sendMessageDingtalk({
        cfg,
        to: id,
        text: PAIRING_APPROVED_MESSAGE,
      });
    },
  },
  capabilities: {
    chatTypes: ["direct", "channel"],
    polls: false,
    threads: true,
    media: true,
    reactions: true,
    edit: true,
    reply: true,
  },
  agentPrompt: {
    messageToolHints: () => [
      "- 钉钉消息目标：省略`target`以回复当前对话（自动推断）。显式目标：`user:userid` 或 `chat:chatid`。",
      "- 钉钉支持富文本消息和卡片消息。",
    ],
  },
  groups: {
    resolveToolPolicy: resolveDingtalkGroupToolPolicy,
  },
  reload: { configPrefixes: ["channels.dingtalk"] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        appId: { type: "string" },
        appSecret: { type: "string" },
        webhookUrl: { type: "string", format: "uri" },
        accessToken: { type: "string" },
        connectionMode: { type: "string", enum: ["websocket", "webhook"] },
        webhookPath: { type: "string" },
        webhookPort: { type: "integer", minimum: 1 },
        dmPolicy: { type: "string", enum: ["open", "pairing", "allowlist"] },
        allowFrom: { type: "array", items: { oneOf: [{ type: "string" }, { type: "number" }] } },
        groupPolicy: { type: "string", enum: ["open", "allowlist", "disabled"] },
        groupAllowFrom: {
          type: "array",
          items: { oneOf: [{ type: "string" }, { type: "number" }] },
        },
        requireMention: { type: "boolean" },
        topicSessionMode: { type: "string", enum: ["disabled", "enabled"] },
        historyLimit: { type: "integer", minimum: 0 },
        dmHistoryLimit: { type: "integer", minimum: 0 },
        textChunkLimit: { type: "integer", minimum: 1 },
        chunkMode: { type: "string", enum: ["length", "newline"] },
        mediaMaxMb: { type: "number", minimum: 0 },
        renderMode: { type: "string", enum: ["auto", "raw", "card"] },
        accounts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              name: { type: "string" },
              appId: { type: "string" },
              appSecret: { type: "string" },
              webhookUrl: { type: "string", format: "uri" },
              accessToken: { type: "string" },
            },
            required: ["appId", "appSecret"],
          },
        },
      },
    },
  },
  config: {
    listAccountIds: (cfg: OpenClawConfig) => listDingtalkAccountIds(cfg),
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) =>
      resolveDingtalkAccount({ cfg, accountId }),
    defaultAccountId: (cfg: OpenClawConfig) => resolveDefaultDingtalkAccountId(cfg),
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...cfg.channels?.dingtalk,
              enabled,
            },
          },
        };
      }
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...cfg.channels?.dingtalk,
            accounts: {
              ...cfg.channels?.dingtalk?.accounts,
              [accountId]: {
                ...cfg.channels?.dingtalk?.accounts?.[accountId],
                enabled,
              },
            },
          },
        },
      };
    },
    deleteAccount: ({ cfg, accountId }) => {
      if (accountId === DEFAULT_ACCOUNT_ID) {
        const { [DEFAULT_ACCOUNT_ID]: _, ...restAccounts } =
          cfg.channels?.dingtalk?.accounts ?? {};
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...cfg.channels?.dingtalk,
              appId: undefined,
              appSecret: undefined,
              webhookUrl: undefined,
              accessToken: undefined,
              accounts: restAccounts,
            },
          },
        };
      }
      const { [accountId]: _, ...restAccounts } = cfg.channels?.dingtalk?.accounts ?? {};
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...cfg.channels?.dingtalk,
            accounts: restAccounts,
          },
        },
      };
    },
    isConfigured: (account) => Boolean(account.appId && account.appSecret),
    describeAccount: (account) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appId && account.appSecret),
    }),
    resolveAllowFrom: ({ cfg, accountId }) =>
      (resolveDingtalkAccount({ cfg, accountId }).config.allowFrom ?? []).map((entry) =>
        String(entry),
      ),
    formatAllowFrom: ({ allowFrom }) =>
      allowFrom.map((entry) => String(entry).trim()).filter(Boolean),
    isEnabled: (account, cfg) => account.enabled,
  },
  security: {
    resolveDmPolicy: ({ cfg, accountId, account }) => {
      const resolvedAccountId = accountId ?? account.accountId ?? DEFAULT_ACCOUNT_ID;
      const basePath = resolvedAccountId === DEFAULT_ACCOUNT_ID 
        ? "channels.dingtalk" 
        : `channels.dingtalk.accounts.${resolvedAccountId}`;
      
      const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
      const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
        providerConfigPresent: cfg.channels?.dingtalk !== undefined,
        groupPolicy: account.config.groupPolicy,
        defaultGroupPolicy,
      });
      
      return {
        dmPolicy: account.config.dmPolicy ?? "pairing",
        allowFrom: account.config.allowFrom ?? [],
        groupPolicy,
        groupAllowFrom: account.config.groupAllowFrom ?? [],
        requireMention: account.config.requireMention ?? true,
        basePath,
      };
    },
    collectWarnings: ({ account, cfg }) => {
      const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
      const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
        providerConfigPresent: cfg.channels?.dingtalk !== undefined,
        groupPolicy: account.config.groupPolicy,
        defaultGroupPolicy,
      });
      
      if (groupPolicy !== "open") {
        return [];
      }
      return [
        `- 钉钉群组：groupPolicy="open" 允许任何成员触发机器人。设置 channels.dingtalk.groupPolicy="allowlist" + channels.dingtalk.groupAllowFrom 来限制发送者。`,
      ];
    },
  },
  groups: {
    resolveRequireMention: () => true,
    resolveToolPolicy: resolveDingtalkGroupToolPolicy,
  },
  messaging: {
    normalizeTarget: normalizeDingtalkTarget,
    targetResolver: {
      looksLikeId: looksLikeDingtalkId,
      hint: "<userid|chatid:ID>",
    },
  },
  setup: {
    resolveAccountId: ({ accountId }) => accountId ?? DEFAULT_ACCOUNT_ID,
    applyAccountName: ({ cfg, accountId, name }) => {
      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...cfg.channels?.dingtalk,
              name,
            },
          },
        };
      }
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...cfg.channels?.dingtalk,
            accounts: {
              ...cfg.channels?.dingtalk?.accounts,
              [accountId]: {
                ...cfg.channels?.dingtalk?.accounts?.[accountId],
                name,
              },
            },
          },
        },
      };
    },
    applyAccountConfig: ({ cfg, accountId, input }) => {
      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...cfg.channels?.dingtalk,
              enabled: true,
              ...(input.appId ? { appId: input.appId } : {}),
              ...(input.appSecret ? { appSecret: input.appSecret } : {}),
              ...(input.webhookUrl ? { webhookUrl: input.webhookUrl } : {}),
              ...(input.accessToken ? { accessToken: input.accessToken } : {}),
            },
          },
        };
      }
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...cfg.channels?.dingtalk,
            enabled: true,
            accounts: {
              ...cfg.channels?.dingtalk?.accounts,
              [accountId]: {
                ...cfg.channels?.dingtalk?.accounts?.[accountId],
                enabled: true,
                ...(input.appId ? { appId: input.appId } : {}),
                ...(input.appSecret ? { appSecret: input.appSecret } : {}),
                ...(input.webhookUrl ? { webhookUrl: input.webhookUrl } : {}),
                ...(input.accessToken ? { accessToken: input.accessToken } : {}),
              },
            },
          },
        },
      };
    },
  },
  outbound: dingtalkOutbound,
  directory: {
    listPeers: listDingtalkDirectoryPeers,
    listGroups: listDingtalkDirectoryGroups,
    listPeersLive: listDingtalkDirectoryPeersLive,
    listGroupsLive: listDingtalkDirectoryGroupsLive,
  },
  onboarding: dingtalkOnboardingAdapter,
  status: {
    buildSummary: buildBaseChannelStatusSummary,
    probeAccount: async ({ account, timeoutMs, cfg }) => {
      return await probeDingtalk(account);
    },
  },
  runtimeState: createDefaultChannelRuntimeState(),
};