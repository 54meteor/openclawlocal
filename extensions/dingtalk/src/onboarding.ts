import type {
  ChannelOnboardingAdapter,
  ChannelOnboardingDmPolicy,
  OpenClawConfig,
  DmPolicy,
  WizardPrompter,
} from "openclaw/plugin-sdk";
import { addWildcardAllowFrom, DEFAULT_ACCOUNT_ID, formatDocsLink } from "openclaw/plugin-sdk";
import type { DingtalkConfig } from "./types.js";

const channel = "dingtalk" as const;

export const dingtalkOnboardingAdapter: ChannelOnboardingAdapter = {
  channel,
  
  async getStatus({ cfg, options }) {
    const channelCfg = cfg.channels?.dingtalk as DingtalkConfig | undefined;
    const configured = Boolean(channelCfg?.appId && channelCfg?.appSecret);
    
    return {
      channel,
      configured,
      selectionHint: configured ? "configured" : "not configured",
      quickstartScore: configured ? 1 : 0,
      statusLines: [
        configured 
          ? "钉钉: 已配置" 
          : "钉钉: 未配置 - 需要AppID和AppSecret"
      ],
    };
  },
  
  async configure({ cfg, runtime, prompter, options }) {
    let next = cfg;
    
    await prompter.note(
      [
        "钉钉机器人配置指南:",
        "1. 登录钉钉开放平台 (https://open-dev.dingtalk.com)",
        "2. 创建企业内部应用",
        "3. 获取AppID和AppSecret",
        "4. 配置机器人回调地址",
      ].join("\n"),
      "钉钉配置"
    );
    
    // 获取AppID
    const appId = await prompter.text({
      message: "钉钉AppID",
      validate: (value) => (value?.trim() ? undefined : "AppID是必需的"),
    });
    
    // 获取AppSecret
    const appSecret = await prompter.text({
      message: "钉钉AppSecret",
      validate: (value) => (value?.trim() ? undefined : "AppSecret是必需的"),
    });
    
    // 询问连接模式
    const connectionMode = await prompter.select({
      message: "连接模式",
      options: [
        { value: "webhook", label: "Webhook (推荐)" },
        { value: "websocket", label: "WebSocket" },
      ],
      initialValue: "webhook",
    });
    
    next = {
      ...next,
      channels: {
        ...next.channels,
        dingtalk: {
          ...next.channels?.dingtalk,
          enabled: true,
          appId: appId.trim(),
          appSecret: appSecret.trim(),
          connectionMode,
        },
      },
    };
    
    // 配置DM策略
    const dmPolicy: DmPolicy = await prompter.select({
      message: "私聊访问策略",
      options: [
        { value: "pairing", label: "配对模式 (推荐)" },
        { value: "allowlist", label: "白名单模式" },
        { value: "open", label: "开放模式 (不推荐)" },
      ],
      initialValue: "pairing",
    });
    
    next = {
      ...next,
      channels: {
        ...next.channels,
        dingtalk: {
          ...next.channels?.dingtalk,
          dmPolicy,
        },
      },
    };
    
    if (dmPolicy === "allowlist") {
      await prompter.note(
        [
          "请输入允许发送私聊消息的用户ID列表。",
          "用户ID可以在钉钉管理后台找到。",
          "多个ID请用逗号分隔。",
        ].join("\n"),
        "钉钉白名单配置"
      );
      
      const allowFromInput = await prompter.text({
        message: "允许的用户ID",
        placeholder: "user1,user2,user3",
      });
      
      const allowFrom = allowFromInput
        .split(",")
        .map(id => id.trim())
        .filter(Boolean);
      
      next = {
        ...next,
        channels: {
          ...next.channels,
          dingtalk: {
            ...next.channels?.dingtalk,
            allowFrom,
          },
        },
      };
    }
    
    return { cfg: next, installed: true };
  },
  
  async disable(cfg) {
    return {
      ...cfg,
      channels: {
        ...cfg.channels,
        dingtalk: {
          ...cfg.channels?.dingtalk,
          enabled: false,
        },
      },
    };
  },
};