import { PORT, SLACK_CHANNEL_ID } from './constants.ts'
import { initializeGather } from './gather.ts'
import { buildExitMessage, buildJoinMessage, initializeSlackApp } from './slack.ts'

const gather = await initializeGather()
const slack = initializeSlackApp()

await slack.start(PORT)
gather.connect()

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
