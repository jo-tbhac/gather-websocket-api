import { serve } from './deps.ts'
import { handleHealthCheck, handleNotFound, handleSubscribe } from './handler.ts'

serve({
  '/subscribe': handleSubscribe,
  '/healthcheck': handleHealthCheck,
  404: handleNotFound,
})
