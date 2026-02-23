import type { ChannelOutbound } from "openclaw/plugin-sdk";

export const dingtalkOutbound: ChannelOutbound = {
  deliveryMode: "direct",
  chunker: (text, limit) => {
    const chunks: string[] = [];
    let current = "";
    
    for (const char of text) {
      if (current.length + 1 > limit) {
        chunks.push(current);
        current = char;
      } else {
        current += char;
      }
    }
    
    if (current) {
      chunks.push(current);
    }
    
    return chunks;
  },
  chunkerMode: "text",
  textChunkLimit: 2000,
  resolveTarget: ({ to, allowFrom }) => {
    if (!to) {
      return { ok: false, error: new Error("目标是必需的") };
    }
    return { ok: true, to };
  },
  sendText: async ({ to, text, accountId, cfg }) => {
    // 钉钉文本消息发送实现
    console.log(`[dingtalk] 发送文本到 ${to}: ${text.substring(0, 50)}...`);
    return { channel: "dingtalk", messageId: "msg_" + Date.now() };
  },
  sendMedia: async ({ to, media, accountId, cfg }) => {
    // 钉钉媒体消息发送实现
    console.log(`[dingtalk] 发送媒体到 ${to}`);
    return { channel: "dingtalk", messageId: "msg_" + Date.now() };
  },
};