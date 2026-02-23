import type { OpenClawConfig } from "openclaw/plugin-sdk";

export async function uploadImageDingtalk(params: {
  cfg: OpenClawConfig;
  imagePath: string;
  accountId?: string;
}): Promise<string> {
  const { cfg, imagePath, accountId } = params;
  // 钉钉图片上传实现
  console.log(`[dingtalk] 上传图片: ${imagePath}`);
  return "media_id_placeholder";
}

export async function uploadFileDingtalk(params: {
  cfg: OpenClawConfig;
  filePath: string;
  accountId?: string;
}): Promise<string> {
  const { cfg, filePath, accountId } = params;
  // 钉钉文件上传实现
  console.log(`[dingtalk] 上传文件: ${filePath}`);
  return "media_id_placeholder";
}

export async function sendImageDingtalk(params: {
  cfg: OpenClawConfig;
  to: string;
  imageUrl: string;
  accountId?: string;
}): Promise<void> {
  const { cfg, to, imageUrl, accountId } = params;
  // 钉钉图片发送实现
  console.log(`[dingtalk] 发送图片到 ${to}: ${imageUrl}`);
}

export async function sendFileDingtalk(params: {
  cfg: OpenClawConfig;
  to: string;
  fileUrl: string;
  fileName?: string;
  accountId?: string;
}): Promise<void> {
  const { cfg, to, fileUrl, fileName, accountId } = params;
  // 钉钉文件发送实现
  console.log(`[dingtalk] 发送文件到 ${to}: ${fileUrl}`);
}

export async function sendMediaDingtalk(params: {
  cfg: OpenClawConfig;
  to: string;
  mediaId: string;
  mediaType: "image" | "file";
  accountId?: string;
}): Promise<void> {
  const { cfg, to, mediaId, mediaType, accountId } = params;
  // 钉钉媒体发送实现
  console.log(`[dingtalk] 发送${mediaType}到 ${to}: ${mediaId}`);
}