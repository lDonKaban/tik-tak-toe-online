import { getIdleGames } from "@/entities/game/services/get-idle-games";
import { GamesListClient } from "./games-list-client";

/**
 * Компонент списка игр.
 * @component
 * @returns {React.ReactNode} Список игр.
 */
export async function GamesList(): Promise<React.ReactNode> {
  const games = await getIdleGames();

  return <GamesListClient games={games} />;
}
