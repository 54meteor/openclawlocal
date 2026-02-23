import type { OpenClawConfig } from "openclaw/plugin-sdk";
import type { ResolvedDingtalkAccount } from "./types.js";
import { resolveDingtalkAccount } from "./accounts.js";

export async function sendMessageDingtalk(params: {
  cfg: OpenClawConfig;
  to: string;
  text: string;
  accountId?: string;
}): Promise<void> {
  const { cfg, to, text, accountId } = params;
  const account = resolveDingtalkAccount({ cfg, accountId });
  
  if (!account.configured) {
    throw new Error("钉钉账户未配置");
  }
  
  // 钉钉消息发送实现
  console.log(`[dingtalk] 发送消息到 ${to}: ${text}`);
}

export async function sendCardDingtalk(params: {
  cfg: OpenClawConfig;
  to: string;
  card: unknown;
  accountId?: string;
}): Promise<void> {
  const { cfg, to, card, accountId } = params;
  const account = resolveDingtalkAccount({ cfg, accountId });
  
  if (!account.configured) {
    throw new Error("钉钉账户未配置");
  }
  
  // 钉钉卡片消息发送实现
  console.log(`[dingtalk] 发送卡片消息到 ${to}`);
}

export async function updateCardDingtalk(params: {
  cfg: OpenClawConfig;
  messageId: string;
  card: unknown;
  accountId?: string;
}): Promise<void> {
  const { cfg, messageId, card, accountId } = params;
  const account = resolveDingtalkAccount({ cfg, accountId });
  
  if (!account.configured) {
    throw new Error("钉钉账户未配置");
  }
  
  // 钉钉卡片更新实现
  console.log(`[dingtalk] 更新卡片消息 ${messageId}`);
}

export async function editMessageDingtalk(params: {
  cfg: OpenClawConfig;
  messageId: string;
  text: string;
  accountId?: string;
}): Promise<void> {
  const { cfg, messageId, text, accountId } = params;
  const account = resolveDingtalkAccount({ cfg, accountId });
  
  if (!account.configured) {
    throw new Error("钉钉账户未配置");
  }
  
  // 钉钉消息编辑实现
  console.log(`[dingtalk] 编辑消息 ${messageId}: ${text}`);
}

export async function getMessageDingtalk(params: {
  cfg: OpenClawConfig;
  messageId: string;
  accountId?: string;
}): Promise<unknown> {
  const { cfg, messageId, accountId } = params;
  const account = resolveDingtalkAccount({ cfg, accountId });
  
  if (!account.configured) {
    throw new Error("钉钉账户未配置");
  }
  
  // 钉钉消息获取实现
  console.log(`[dingtalk] 获取消息 ${messageId}`);
  return null;
}