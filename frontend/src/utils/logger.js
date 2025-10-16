// src/utils/logger.js
// Unified logger for Family Office app

const LOG_LEVELS = {
  info: "🟢",
  warn: "🟠",
  error: "🔴",
};

export function logInfo(msg, ...args) {
  console.info(`${LOG_LEVELS.info} [INFO]`, msg, ...args);
}

export function logWarn(msg, ...args) {
  console.warn(`${LOG_LEVELS.warn} [WARN]`, msg, ...args);
}

export function logError(msg, ...args) {
  console.error(`${LOG_LEVELS.error} [ERROR]`, msg, ...args);
}

// Optional: send logs to Logtail/BetterStack
export async function logRemote(level, msg, meta = {}) {
  if (!import.meta.env.VITE_LOGTAIL_TOKEN) return;
  try {
    await fetch("https://in.logtail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_LOGTAIL_TOKEN}`,
      },
      body: JSON.stringify({
        level,
        message: msg,
        meta,
        dt: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // Don't throw on remote log failure
  }
}
