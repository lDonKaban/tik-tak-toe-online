import { startTransition, useState } from "react";
import { useEventsSource } from "@/shared/lib/sse/client";
import { GameId } from "@/kernel/ids";
import { GameDomain } from "@/entities/game";
import { routes } from "@/kernel/routes";
import { gameStepAction } from "../actions/game-step";

/**
 * Хук для получения игры по идентификатору.
 * @param {GameId} gameId - идентификатор игры.
 * @returns {{ game: GameDomain.GameEntity | undefined; isPending: boolean }} - игра и состояние загрузки.
 */
export const useGame = (gameId: GameId, player: GameDomain.PlayerEntity) => {
  const { dataStream: game, isPending } =
    useEventsSource<GameDomain.GameEntity>(routes.gameStream(gameId), () => {
      dispatchOptimistic(undefined);
    });

  const [optimisticGame, dispatchOptimistic] =
    useState<GameDomain.GameEntity>();

  const step = async (index: number) => {
    if (game && game.status === "inProgress") {
      const result = GameDomain.doStep({ game, player, cellIndex: index });
      if (result.type === "right") {
        dispatchOptimistic(result.value);
      }
    }
    startTransition(async () => {
      await gameStepAction({ gameId, index });
    });
  };

  return {
    game: optimisticGame ?? game,
    step,
    isPending,
  };
};
