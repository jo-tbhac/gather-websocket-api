import { SLACK_CHANNEL_ID } from './constants.ts'
import { parseArgs, serve } from './deps.ts'
import { connect, initializeGather } from './gather.ts'
import { handleHealthCheck, handleNotFound } from './handler.ts'
import { log, LOG_LEVEL } from './log.ts'
import { buildExitMessage, buildJoinMessage, postMessage } from './slack.ts'
import { Player } from './types.ts'

const port: string | undefined = parseArgs(Deno.args).port

serve({
  '/healthcheck': handleHealthCheck,
  404: handleNotFound,
}, { port: port ? Number(port) : 8000 })

const gather = await initializeGather()

await connect(gather)

const joinedPlayers = new Map<string, Player>(
  Object.values(gather.players).map(({ id, name }) => [id, { id, name }]),
)

log(LOG_LEVEL.info, 'initial players: ', joinedPlayers)

gather.subscribeToEvent('playerJoins', (_, context) => {
  // ユーザーがログイン状態と判定されずユーザー名が取得できないケースがあるので、ログイン状態になるまで3秒ぐらい待つ
  setTimeout(async () => {
    const { playerId } = context
    const playerName = context.player?.name ?? ''
    const playersCount = Object.keys(gather.players).length

    log(LOG_LEVEL.info, 'player joins: ', context)
    log(LOG_LEVEL.info, 'current players: ', joinedPlayers)
    log(LOG_LEVEL.info, '='.repeat(80))

    if (playerId == null || joinedPlayers.has(playerId)) {
      return
    }

    await postMessage({
      channel: SLACK_CHANNEL_ID,
      text: buildJoinMessage(playerName, playersCount),
    })

    joinedPlayers.set(playerId, { id: playerId, name: playerName })
  }, 3000)
})

gather.subscribeToEvent('playerExits', async (_, context) => {
  const { playerId } = context
  const playerName = context.player?.name ?? ''
  const playersCount = Object.keys(gather.players).length

  log(LOG_LEVEL.info, 'player exits: ', context)
  log(LOG_LEVEL.info, 'current players: ', joinedPlayers)
  log(LOG_LEVEL.info, '='.repeat(80))

  if (playerId == null) {
    return
  }

  await postMessage({
    channel: SLACK_CHANNEL_ID,
    text: buildExitMessage(playerName, playersCount),
  })

  joinedPlayers.delete(playerId)
})
