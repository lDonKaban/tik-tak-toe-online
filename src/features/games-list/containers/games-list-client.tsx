"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { routes } from "@/kernel/routes";
import { GameDomain } from "@/entities/game";
import { useEventsSource } from "@/shared/lib/sse/client";
import { Layout } from "../ui/layout";
import { GameCard } from "../ui/game-card";
import { CreateButton } from "./create-button";

/**
 * Компонент списка игр.
 * @component
 * @returns {React.ReactNode} Список игр.
 */
export function GamesListClient({
  games,
}: {
  games: GameDomain.GameIdleEntity[];
}): React.ReactNode {
  const { dataStream: gamesStream = games } = useEventsSource<
    GameDomain.GameIdleEntity[]
  >(routes.gamesStream());

  return (
    <Layout actions={<CreateButton />}>
      {gamesStream.map((game) => (
        <GameCard
          key={game.id}
          login={game.creator.login}
          rating={game.creator.rating}
          actions={
            <Link href={routes.game(game.id)}>
              <Button className="cursor-pointer">Подключиться</Button>
            </Link>
          }
        />
      ))}
    </Layout>
  );
}
