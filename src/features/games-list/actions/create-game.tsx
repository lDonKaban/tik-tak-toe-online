"use server";

import { redirect } from "next/navigation";
import { createGame } from "@/entities/game/services/create-game";
import { left, right } from "@/shared/lib/either";
import { getCurrentUser } from "@/entities/user/services/get-current-user";
import { routes } from "@/kernel/routes";

/** Серверная функция для создания новой игры */
export const createGameAction = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return left("user-not-found");
  }

  const gameResult = await createGame(user);

  if (gameResult.type === "right") {
    redirect(routes.game(gameResult.value.id));
  }

  return gameResult;
};
