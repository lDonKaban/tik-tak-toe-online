import { GameId } from "@/kernel/ids";
import { left, right } from "@/shared/lib/either";
import { updateRating } from "@/entities/user/@x/game";
import { doStep, PlayerEntity } from "../domain";
import { gameRepository } from "../repositories/game";
import { gameEvents } from "./game-events";

/**
 * Принудительно завершает игру, если игрок вышел
 * @param gameId - Идентификатор игры.
 * @param player - Игрок, который вышел из игры.
 * @returns {Promise<Either<"game-not-found" | "game-is-not-in-progress" | "player-is-not-in-game", GameEntity>>} Результат завершения игры.
 */
export const stepGame = async (
  gameId: GameId,
  player: PlayerEntity,
  index: number,
) => {
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

  const stepResult = doStep({ game, player, cellIndex: index });

  if (stepResult.type === "left") {
    return stepResult;
  }

  const newGame = await gameRepository.saveGame(stepResult.value);

  if (newGame.status === "gameOver") {
    await updateRating({
      players: newGame.players as [
        Pick<PlayerEntity, "id" | "login" | "rating">,
        Pick<PlayerEntity, "id" | "login" | "rating">,
      ],
      winnerId: newGame.winner.id,
    });
  }

  if (newGame.status === "gameOverDraw") {
    await updateRating({
      players: newGame.players as [
        Pick<PlayerEntity, "id" | "login" | "rating">,
        Pick<PlayerEntity, "id" | "login" | "rating">,
      ],
      winnerId: null,
    });
  }

  await gameEvents.emit({
    type: "game-changed",
    data: newGame,
  });

  return right(newGame);
};
