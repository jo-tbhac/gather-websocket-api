import { load } from './deps.ts'

await load({ export: true })

export const GATHER_SPACE_ID = Deno.env.get('GATHER_SPACE_ID') ?? ''
export const GATHER_API_KEY = Deno.env.get('GATHER_API_KEY') ?? ''
export const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN') ?? ''
export const SLACK_CHANNEL_ID = Deno.env.get('SLACK_CHANNEL_ID') ?? ''
export const API_KEY = Deno.env.get('API_KEY') ?? ''
