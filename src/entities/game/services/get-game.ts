import { GameId } from "@/kernel/ids";
import { gameRepository } from "../repositories/game";

/**
 * Возвращает игру по идентификатору.
 * @param gameId - Идентификатор игры.
 * @returns {Promise<GameEntity | undefined>} Игра или undefined, если не найдена.
 */
export const getGameById = (gameId: GameId) => {
  return gameRepository.getGame({ id: gameId });
};
