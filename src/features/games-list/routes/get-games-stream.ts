import { NextRequest } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getCurrentUser } from "@/entities/user/server";
import { getIdleGames } from "@/entities/game/services/get-idle-games";
import { gameEvents } from "@/entities/game/services/game-events";

/**
 * Обработчик запроса на получение потока игры.
 * @param {NextRequest} req - запрос.
 * @param {{ params: Promise<{ id: GameId }> }} params - параметры запроса.
 */
export const getGamesStreamRoute = async (req: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    return new Response("Игрок не найден", { status: 404 });
  }

  const { response, addCloseListener, write } = sseStream(req);

  write(await getIdleGames());

  addCloseListener(
    await gameEvents.addGameCreatedListener(async () => {
      write(await getIdleGames());
    }),
  );

  return response;
};
