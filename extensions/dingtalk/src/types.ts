export type DingtalkConfig = {
  enabled?: boolean;
  name?: string;
  appId?: string;
  appSecret?: string;
  webhookUrl?: string;
  accessToken?: string;
  connectionMode?: "websocket" | "webhook";
  webhookPath?: string;
  webhookPort?: number;
  dmPolicy?: "open" | "pairing" | "allowlist";
  allowFrom?: Array<string | number>;
  groupPolicy?: "open" | "allowlist" | "disabled";
  groupAllowFrom?: Array<string | number>;
  requireMention?: boolean;
  topicSessionMode?: "disabled" | "enabled";
  historyLimit?: number;
  dmHistoryLimit?: number;
  textChunkLimit?: number;
  chunkMode?: "length" | "newline";
  mediaMaxMb?: number;
  renderMode?: "auto" | "raw" | "card";
  accounts?: Record<string, {
    enabled?: boolean;
    name?: string;
    appId: string;
    appSecret: string;
    webhookUrl?: string;
    accessToken?: string;
    dmPolicy?: "open" | "pairing" | "allowlist";
    allowFrom?: Array<string | number>;
    groupPolicy?: "open" | "allowlist" | "disabled";
    groupAllowFrom?: Array<string | number>;
    requireMention?: boolean;
    topicSessionMode?: "disabled" | "enabled";
    historyLimit?: number;
    dmHistoryLimit?: number;
    textChunkLimit?: number;
    chunkMode?: "length" | "newline";
    mediaMaxMb?: number;
    renderMode?: "auto" | "raw" | "card";
  }>;
};

export type ResolvedDingtalkAccount = {
  accountId: string;
  name: string;
  enabled: boolean;
  configured: boolean;
  config: {
    appId: string;
    appSecret: string;
    webhookUrl?: string;
    accessToken?: string;
    dmPolicy?: "open" | "pairing" | "allowlist";
    allowFrom?: Array<string | number>;
    groupPolicy?: "open" | "allowlist" | "disabled";
    groupAllowFrom?: Array<string | number>;
    requireMention?: boolean;
    topicSessionMode?: "disabled" | "enabled";
    historyLimit?: number;
    dmHistoryLimit?: number;
    textChunkLimit?: number;
    chunkMode?: "length" | "newline";
    mediaMaxMb?: number;
    renderMode?: "auto" | "raw" | "card";
  };
};

export type DingtalkMessageEvent = {
  msgtype: string;
  text?: {
    content: string;
  };
  senderId?: string;
  senderNick?: string;
  chatbotUserId?: string;
  conversationId?: string;
  conversationType?: string;
  atUsers?: Array<{
    dingtalkId: string;
  }>;
};

export type DingtalkBotAddedEvent = {
  eventType: string;
  appId: string;
  corpId: string;
};