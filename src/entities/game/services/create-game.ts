import cuid from "cuid";
import { left, right } from "@/shared/lib/either";
import { gameEvents } from "./game-events";
import { gameRepository } from "../repositories/game";
import { PlayerEntity } from "../domain";

/**
 * Создает новую игру для игрока.
 * @param player - Игрок, создавший игру.
 * @returns {Promise<Either<string, GameEntity>>} Результат создания игры (ошибка или созданная игра).
 */
export const createGame = async (player: PlayerEntity) => {
  const playerGames = await gameRepository.gamesList({
    players: { some: { id: player.id } },
    status: "idle",
  });

  const isGameInIdleStatus = playerGames.some(
    (game) => game.status === "idle" && game.creator.id === player.id,
  );

  /* TODO: пока не ограничиваю пользователя созданием одной игры */
  // if (isGameInIdleStatus) {
  //   return left("can-create-only-one-game" as const);
  // }

  const createdGame = await gameRepository.createGame({
    status: "idle",
    creator: player,
    id: cuid(),
    field: Array(9).fill(null),
  });

  await gameEvents.emit({
    type: "game-created",
  });

  return right(createdGame);
};
