import { GATHER_API_KEY, GATHER_SPACE_ID } from './constants.ts'
import { Game } from './deps.ts'

export const initializeGather = async () => {
  const game = new Game(
    GATHER_SPACE_ID,
    () => Promise.resolve({ apiKey: GATHER_API_KEY }),
  )

  return await game
}

export const connect = async (game: Game) => {
  return await new Promise<void>((resolve, reject) => {
    game.connect()
    game.subscribeToConnection((connected) => {
      if (connected) {
        // 接続直後はまだplayersの取得ができないので少し待つ（取得可能になったかどうかを判定できるイベントないのかな...）
        setTimeout(() => {
          resolve()
        }, 5000)
      } else {
        reject(new Error('Error: gather connection error'))
      }
    })
  })
}
