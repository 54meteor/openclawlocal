export function normalizeDingtalkTarget(raw: string): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return undefined;
  }
  // 移除钉钉前缀
  return trimmed.replace(/^(dingtalk|dt):/i, "");
}

export function looksLikeDingtalkId(raw: string, normalized: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) {
    return false;
  }
  // 检查是否为钉钉ID格式
  return /^[a-zA-Z0-9_-]+$/.test(normalized);
}

export function formatDingtalkTarget(target: string): string {
  return target.trim();
}