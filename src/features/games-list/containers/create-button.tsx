"use client";

import { startTransition } from "react";
import { useActionState } from "@/shared/lib/react";
import { Button } from "@/shared/ui/button";
import { right, mapLeft } from "@/shared/lib/either";
import { createGameAction } from "../actions/create-game";

/**
 * Компонент кнопки для создания новой игры.
 * @component
 * @returns {React.ReactNode} Кнопка для создания новой игры.
 */
export function CreateButton(): React.ReactNode {
  const [data, dispatch, isPending] = useActionState(
    createGameAction,
    right(undefined),
  );
  return (
    <div className="grid grid-rows-[auto_24px] gap-1 w-full">
      <Button
        disabled={isPending}
        onClick={() => startTransition(dispatch)}
        className="w-1/2 font-bold cursor-pointer"
        error={mapLeft(
          data,
          (e) =>
            ({
              ["can-create-only-one-game"]:
                "Вы можете создать только одну игру",
              ["user-not-found"]: "Пользователь не найден",
            })[e],
        )}
      >
        Создать игру
      </Button>
    </div>
  );
}
