import { SLACK_APP_PORT } from './constants.ts'
import { serve } from './deps.ts'
import { initializeGather } from './gather.ts'
import { initializeSlackApp } from './slack.ts'
import { handleHealthCheck, handleNotFound, handleSubscribe } from './handler.ts'

serve({
  '/subscribe': async (request) => await handleSubscribe(request, { gather, slack }),
  '/healthcheck': handleHealthCheck,
  404: handleNotFound,
})

const gather = await initializeGather()
const slack = initializeSlackApp()

await slack.start(SLACK_APP_PORT)
gather.connect()
