import type { ResolvedDingtalkAccount } from "./types.js";

export async function probeDingtalk(
  account: ResolvedDingtalkAccount,
): Promise<{ ok: true; appId: string } | { ok: false; error: string }> {
  if (!account.configured) {
    return { ok: false, error: "未配置钉钉凭证" };
  }
  
  try {
    // 钉钉连接探测实现
    // 这里应该实现实际的钉钉API连接测试
    
    return {
      ok: true,
      appId: account.config.appId,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}