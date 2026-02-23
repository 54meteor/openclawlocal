import type { OpenClawConfig } from "openclaw/plugin-sdk";
import type { ResolvedDingtalkAccount } from "./types.js";
import { resolveDingtalkAccount } from "./accounts.js";

export async function listDingtalkDirectoryPeers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string;
}): Promise<Array<{ id: string; name: string; type: "user" }>> {
  // 钉钉用户目录查询实现
  return [];
}

export async function listDingtalkDirectoryGroups(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string;
}): Promise<Array<{ id: string; name: string; type: "group" }>> {
  // 钉钉群组目录查询实现
  return [];
}

export async function listDingtalkDirectoryPeersLive(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string;
}): Promise<Array<{ id: string; name: string; type: "user" }>> {
  // 钉钉实时用户目录查询实现
  return [];
}

export async function listDingtalkDirectoryGroupsLive(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string;
}): Promise<Array<{ id: string; name: string; type: "group" }>> {
  // 钉钉实时群组目录查询实现
  return [];
}