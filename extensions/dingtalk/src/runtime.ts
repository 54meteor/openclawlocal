import type { RuntimeEnv } from "openclaw/plugin-sdk";

let dingtalkRuntime: RuntimeEnv | undefined;

export function setDingtalkRuntime(runtime: RuntimeEnv): void {
  dingtalkRuntime = runtime;
}

export function getDingtalkRuntime(): RuntimeEnv | undefined {
  return dingtalkRuntime;
}