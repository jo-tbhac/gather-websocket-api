import { SLACK_BOT_TOKEN } from './constants.ts'

export const buildJoinMessage = (playerName: string, playersCount: number) => {
  const message = `*${playerName}* さんが出社しました:bulb:\n現在${playersCount}人が出社中です。`
  return message
}

export const buildExitMessage = (playerName: string, playersCount: number) => {
  const message = `*${playerName}* さんが退社しました:wave:\n現在${playersCount}人が出社中です。`
  return message
}

export const postMessage = async ({ text, channel }: { text: string; channel: string }) => {
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel,
      text,
    }),
  })
}
