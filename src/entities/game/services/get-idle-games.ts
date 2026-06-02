import "server-only";

import { gameRepository } from "../repositories/game";
import { GameIdleEntity } from "../domain";

/**
 * Получает список ожидающих игр.
 * @returns {Promise<GameIdleEntity[]>} Список ожидающих игр.
 */
export const getIdleGames = async (): Promise<GameIdleEntity[]> => {
  const games = await gameRepository.gamesList({ status: "idle" });

  return games as GameIdleEntity[];
};
