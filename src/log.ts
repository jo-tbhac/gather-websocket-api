export const LOG_LEVEL = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
} as const

type LogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL]

// deno-lint-ignore no-explicit-any
export const log = (level: LogLevel, ...data: any) => {
  console.log(`[${level}] `, ...data)
}
