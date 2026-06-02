"use server";

import { GameId } from "@/kernel/ids";
import { stepGame } from "@/entities/game/services/step-game";
import { getCurrentUser } from "@/entities/user/server";
import { left } from "@/shared/lib/either";

export const gameStepAction = async ({
  gameId,
  index,
}: {
  gameId: GameId;
  index: number;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return left("not-found");
  }

  return await stepGame(gameId, currentUser, index);
};
