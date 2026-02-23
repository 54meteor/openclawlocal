import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { dingtalkPlugin } from "./src/channel.js";
import { setDingtalkRuntime } from "./src/runtime.js";

export { monitorDingtalkProvider } from "./src/monitor.js";
export {
  sendMessageDingtalk,
  sendCardDingtalk,
  updateCardDingtalk,
  editMessageDingtalk,
  getMessageDingtalk,
} from "./src/send.js";
export {
  uploadImageDingtalk,
  uploadFileDingtalk,
  sendImageDingtalk,
  sendFileDingtalk,
  sendMediaDingtalk,
} from "./src/media.js";
export { probeDingtalk } from "./src/probe.js";
export {
  addReactionDingtalk,
  removeReactionDingtalk,
  listReactionsDingtalk,
} from "./src/reactions.js";
export {
  extractMentionTargets,
  extractMessageBody,
  formatMentionForText,
  formatMentionForCard,
  buildMentionedMessage,
  buildMentionedCardContent,
  type MentionTarget,
} from "./src/mention.js";
export { dingtalkPlugin } from "./src/channel.js";

const plugin = {
  id: "dingtalk",
  name: "DingTalk",
  description: "DingTalk channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setDingtalkRuntime(api.runtime);
    api.registerChannel({ plugin: dingtalkPlugin });
  },
};

export default plugin;