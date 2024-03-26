import { GATHER_API_KEY, GATHER_SPACE_ID } from './constants.ts'
import { Game } from './deps.ts'

export const initializeGather = async () => {
  const game = new Game(
    GATHER_SPACE_ID,
    () => Promise.resolve({ apiKey: GATHER_API_KEY }),
  )

  return await game
}
