export async function addReactionDingtalk(params: {
  messageId: string;
  reaction: string;
  accountId?: string;
}): Promise<void> {
  const { messageId, reaction, accountId } = params;
  // 钉钉添加反应实现
  console.log(`[dingtalk] 添加反应 ${reaction} 到消息 ${messageId}`);
}

export async function removeReactionDingtalk(params: {
  messageId: string;
  reaction: string;
  accountId?: string;
}): Promise<void> {
  const { messageId, reaction, accountId } = params;
  // 钉钉移除反应实现
  console.log(`[dingtalk] 移除反应 ${reaction} 从消息 ${messageId}`);
}

export async function listReactionsDingtalk(params: {
  messageId: string;
  accountId?: string;
}): Promise<Array<{ reaction: string; count: number }>> {
  const { messageId, accountId } = params;
  // 钉钉列举反应实现
  console.log(`[dingtalk] 列举消息 ${messageId} 的反应`);
  return [];
}