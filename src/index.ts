import { parseArgs, serve } from './deps.ts'
import { handleHealthCheck, handleNotFound, handleSubscribe } from './handler.ts'

const port: string | undefined = parseArgs(Deno.args).port

serve({
  '/subscribe': handleSubscribe,
  '/healthcheck': handleHealthCheck,
  404: handleNotFound,
}, { port: port ? Number(port) : 8000 })
