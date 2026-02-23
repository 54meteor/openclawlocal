import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";
import type { ResolvedDingtalkAccount, DingtalkConfig } from "./types.js";

export function resolveDingtalkCredentials(
  account: ResolvedDingtalkAccount,
): { appId: string; appSecret: string; webhookUrl?: string; accessToken?: string } | null {
  if (!account.config.appId?.trim() || !account.config.appSecret?.trim()) {
    return null;
  }
  return {
    appId: account.config.appId.trim(),
    appSecret: account.config.appSecret.trim(),
    webhookUrl: account.config.webhookUrl?.trim(),
    accessToken: account.config.accessToken?.trim(),
  };
}

export function listDingtalkAccountIds(cfg: OpenClawConfig): string[] {
  const channelCfg = cfg.channels?.dingtalk as DingtalkConfig | undefined;
  if (!channelCfg) {
    return [];
  }
  const accounts = channelCfg.accounts ?? {};
  return [
    ...(channelCfg.appId ? [DEFAULT_ACCOUNT_ID] : []),
    ...Object.keys(accounts).filter((id) => accounts[id]?.appId),
  ];
}

export function resolveDefaultDingtalkAccountId(cfg: OpenClawConfig): string {
  const ids = listDingtalkAccountIds(cfg);
  return ids[0] ?? DEFAULT_ACCOUNT_ID;
}

export function resolveDingtalkAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedDingtalkAccount {
  const { cfg, accountId } = params;
  const channelCfg = cfg.channels?.dingtalk as DingtalkConfig | undefined;
  const targetAccountId = accountId?.trim() || resolveDefaultDingtalkAccountId(cfg);
  
  if (targetAccountId === DEFAULT_ACCOUNT_ID) {
    return {
      accountId: DEFAULT_ACCOUNT_ID,
      name: channelCfg?.name ?? "DingTalk",
      enabled: channelCfg?.enabled ?? false,
      configured: Boolean(channelCfg?.appId && channelCfg?.appSecret),
      config: {
        appId: channelCfg?.appId ?? "",
        appSecret: channelCfg?.appSecret ?? "",
        webhookUrl: channelCfg?.webhookUrl,
        accessToken: channelCfg?.accessToken,
        dmPolicy: channelCfg?.dmPolicy,
        allowFrom: channelCfg?.allowFrom,
        groupPolicy: channelCfg?.groupPolicy,
        groupAllowFrom: channelCfg?.groupAllowFrom,
        requireMention: channelCfg?.requireMention,
        topicSessionMode: channelCfg?.topicSessionMode,
        historyLimit: channelCfg?.historyLimit,
        dmHistoryLimit: channelCfg?.dmHistoryLimit,
        textChunkLimit: channelCfg?.textChunkLimit,
        chunkMode: channelCfg?.chunkMode,
        mediaMaxMb: channelCfg?.mediaMaxMb,
        renderMode: channelCfg?.renderMode,
      },
    };
  }

  const accountCfg = channelCfg?.accounts?.[targetAccountId];
  return {
    accountId: targetAccountId,
    name: accountCfg?.name ?? targetAccountId,
    enabled: accountCfg?.enabled ?? false,
    configured: Boolean(accountCfg?.appId && accountCfg?.appSecret),
    config: {
      appId: accountCfg?.appId ?? "",
      appSecret: accountCfg?.appSecret ?? "",
      webhookUrl: accountCfg?.webhookUrl,
      accessToken: accountCfg?.accessToken,
      dmPolicy: accountCfg?.dmPolicy ?? channelCfg?.dmPolicy,
      allowFrom: accountCfg?.allowFrom ?? channelCfg?.allowFrom,
      groupPolicy: accountCfg?.groupPolicy ?? channelCfg?.groupPolicy,
      groupAllowFrom: accountCfg?.groupAllowFrom ?? channelCfg?.groupAllowFrom,
      requireMention: accountCfg?.requireMention ?? channelCfg?.requireMention,
      topicSessionMode: accountCfg?.topicSessionMode ?? channelCfg?.topicSessionMode,
      historyLimit: accountCfg?.historyLimit ?? channelCfg?.historyLimit,
      dmHistoryLimit: accountCfg?.dmHistoryLimit ?? channelCfg?.dmHistoryLimit,
      textChunkLimit: accountCfg?.textChunkLimit ?? channelCfg?.textChunkLimit,
      chunkMode: accountCfg?.chunkMode ?? channelCfg?.chunkMode,
      mediaMaxMb: accountCfg?.mediaMaxMb ?? channelCfg?.mediaMaxMb,
      renderMode: accountCfg?.renderMode ?? channelCfg?.renderMode,
    },
  };
}