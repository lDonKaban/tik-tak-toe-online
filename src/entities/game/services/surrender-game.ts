import { GameId } from "@/kernel/ids";
import { left, right } from "@/shared/lib/either";
import { updateRating } from "@/entities/user/@x/game";
import { gameEvents } from "./game-events";
import { PlayerEntity, GameOverEntity } from "../domain";
import { gameRepository } from "../repositories/game";

/**
 * Принудительно завершает игру, если игрок вышел
 * @param gameId - Идентификатор игры.
 * @param player - Игрок, который вышел из игры.
 * @returns {Promise<Either<"game-not-found" | "game-is-not-in-progress" | "player-is-not-in-game", GameEntity>>} Результат завершения игры.
 */
export const surrenderGame = async (gameId: GameId, player: PlayerEntity) => {
  const game = await gameRepository.getGame({ id: gameId });

  if (!game) {
    return left("game-not-found");
  }

  if (game.status !== "inProgress") {
    return left("game-is-not-in-progress");
  }

  if (!game.players.some((p) => p.id === player.id)) {
    return left("player-is-not-in-game");
  }

  const newGame = (await gameRepository.saveGame({
    ...game,
    status: "gameOver",
    winner: game.players.find((p) => p.id !== player.id)!,
  })) as GameOverEntity;

  await updateRating({
    players: newGame.players as [
      Pick<PlayerEntity, "id" | "login" | "rating">,
      Pick<PlayerEntity, "id" | "login" | "rating">,
    ],
    winnerId: newGame.winner.id,
  });

  await gameEvents.emit({
    type: "game-changed",
    data: newGame,
  });

  return right(newGame);
};
