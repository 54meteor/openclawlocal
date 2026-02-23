import type { GroupToolPolicyParams } from "openclaw/plugin-sdk";
import type { ResolvedDingtalkAccount } from "./types.js";

export function resolveDingtalkGroupToolPolicy(
  params: GroupToolPolicyParams<ResolvedDingtalkAccount>,
): "allow" | "deny" | "confirm" {
  const { account, senderId, toolName } = params;
  
  // 如果群组策略为disabled，则拒绝所有工具调用
  if (account.config.groupPolicy === "disabled") {
    return "deny";
  }
  
  // 如果群组策略为allowlist，检查发送者是否在允许列表中
  if (account.config.groupPolicy === "allowlist") {
    const allowFrom = account.config.groupAllowFrom ?? [];
    if (!allowFrom.includes(senderId)) {
      return "deny";
    }
  }
  
  // 检查特定工具的发送者权限
  const toolsBySender = account.config.toolsBySender;
  if (toolsBySender) {
    const senderTools = toolsBySender[senderId];
    if (senderTools === false) {
      return "deny";
    }
    if (Array.isArray(senderTools) && !senderTools.includes(toolName)) {
      return "deny";
    }
  }
  
  return "allow";
}