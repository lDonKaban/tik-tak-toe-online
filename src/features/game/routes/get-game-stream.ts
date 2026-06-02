import { NextRequest } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import { GameId } from "@/kernel/ids";
import { getGameById } from "@/entities/game/services/get-game";
import { getCurrentUser } from "@/entities/user/server";
import { surrenderGame } from "@/entities/game/services/surrender-game";
import { gameEvents } from "@/entities/game/services/game-events";

/**
 * Обработчик запроса на получение потока игры.
 * @param {NextRequest} req - запрос.
 * @param {{ params: Promise<{ id: GameId }> }} params - параметры запроса.
 */
export const getGameStream = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: GameId }> },
) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const game = await getGameById(id);

  if (!game || !user) {
    return new Response("Игра не найдена", { status: 404 });
  }

  const { response, addCloseListener, write } = sseStream(req);

  write(game);

  const unwatch = await gameEvents.addGameChangedListener(game.id, (event) => {
    write(event.data);
  });

  addCloseListener(async () => {
    await surrenderGame(id, user);

    unwatch();
  });

  return response;
};
