import { API_KEY, SLACK_CHANNEL_ID } from './constants.ts'
import { Game, validateRequest } from './deps.ts'
import { buildExitMessage, buildJoinMessage, initializeSlackApp } from './slack.ts'

const authenticate = (request: Request) => {
  const token = request.headers.get('authorization')
  return { ok: token === `Bearer ${API_KEY}` }
}

export const handleNotFound = () => {
  return new Response('not found', { status: 404 })
}

export const handleHealthCheck = async (request: Request) => {
  const { error } = await validateRequest(request, { GET: {} })
  if (error) {
    return new Response(error.message, { status: error.status })
  }

  return new Response('ok', { status: 200 })
}

export const handleSubscribe = async (
  request: Request,
  { gather, slack }: { gather: Game; slack: ReturnType<typeof initializeSlackApp> },
) => {
  const { error } = await validateRequest(request, { POST: {} })
  if (error) {
    return new Response(error.message, { status: error.status })
  }

  const result = authenticate(request)
  if (!result.ok) {
    return new Response('invalid request', { status: 401 })
  }

  gather.subscribeToEvent('playerJoins', (_, context) => {
    // ユーザーがログイン状態と判定されずユーザー名が取得できないケースがあるので、ログイン状態になるまで3秒ぐらい待つ
    setTimeout(async () => {
      const playerName = context.player?.name ?? ''
      const playersCount = Object.keys(gather.players).length

      await slack.client.chat.postMessage({
        channel: SLACK_CHANNEL_ID,
        mrkdwn: true,
        text: buildJoinMessage(playerName, playersCount),
      })
    }, 3000)
  })

  gather.subscribeToEvent('playerExits', async (_, context) => {
    const playerName = context.player?.name ?? ''
    const playersCount = Object.keys(gather.players).length

    await slack.client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      mrkdwn: true,
      text: buildExitMessage(playerName, playersCount),
    })
  })

  return new Response('ok', { status: 200 })
}
