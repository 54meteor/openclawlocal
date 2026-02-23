export type MentionTarget = {
  type: "user" | "all";
  id?: string;
};

export function extractMentionTargets(text: string): MentionTarget[] {
  // 钉钉提及目标提取实现
  const mentions: MentionTarget[] = [];
  
  // 提取@all
  if (text.includes("@all")) {
    mentions.push({ type: "all" });
  }
  
  // 提取@用户
  const userMentions = text.match(/@(\w+)/g);
  if (userMentions) {
    userMentions.forEach(match => {
      const userId = match.substring(1);
      mentions.push({ type: "user", id: userId });
    });
  }
  
  return mentions;
}

export function extractMessageBody(text: string): string {
  // 提取消息正文（去除提及）
  return text.replace(/@\w+/g, "").trim();
}

export function formatMentionForText(target: MentionTarget): string {
  if (target.type === "all") {
    return "@all";
  }
  return `@${target.id}`;
}

export function formatMentionForCard(target: MentionTarget): string {
  if (target.type === "all") {
    return "<!all>";
  }
  return `<@${target.id}>`;
}

export function buildMentionedMessage(targets: MentionTarget[], body: string): string {
  const mentions = targets.map(formatMentionForText).join(" ");
  return `${mentions} ${body}`.trim();
}

export function buildMentionedCardContent(targets: MentionTarget[], body: string): string {
  const mentions = targets.map(formatMentionForCard).join(" ");
  return `${mentions} ${body}`.trim();
}