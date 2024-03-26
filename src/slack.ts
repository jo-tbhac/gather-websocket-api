import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './constants.ts'
import { SlackApp } from './deps.ts'

export const initializeSlackApp = () => {
  const app = new SlackApp.App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
  })

  return app
}

export const buildJoinMessage = (playerName: string, playersCount: number) => {
  const message = `*${playerName}* さんが参加しました:bulb:\n現在${playersCount}人が参加中です。`
  return message
}

export const buildExitMessage = (playerName: string, playersCount: number) => {
  const message = `*${playerName}* さんが退出しました:wave:\n現在${playersCount}人が参加中です。`
  return message
}
