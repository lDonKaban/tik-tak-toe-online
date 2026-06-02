"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/user/server";
import { GameId } from "@/kernel/ids";
import { GameClient } from "./game-client";
import { getGameById } from "@/entities/game/services/get-game";
import { startGame } from "@/entities/game/services/start-game";

/**
 * Серверный компонент игры.
 * @component
 * @param {GameId} gameId - идентификатор игры.
 * @returns {React.ReactNode} - JSX-узел.
 */
export const Game = async ({ gameId }: { gameId: GameId }) => {
  const user = await getCurrentUser();

  let game = await getGameById(gameId);

  if (!game || !user) {
    redirect("/");
  }

  if (user) {
    const startGameResult = await startGame(gameId, user);

    if (startGameResult.type === "right") {
      game = startGameResult.value;
    }
  }

  return <GameClient defaultGame={game} player={user} />;
};
