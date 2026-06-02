"use client";

import { GameDomain } from "@/entities/game";
import { useGame } from "../model/use-game";
import { GameLayout } from "../ui/layout";
import { GamePlayers } from "../ui/players";
import { GameStatus } from "../ui/status";
import { GameField } from "../ui/field";
import { ExitButton } from "../ui/exit";

/**
 * Клиентский компонент игры.
 * @component
 * @param {GameDomain.GameEntity} defaultGame - начальная игра.
 */
export const GameClient = ({
  defaultGame,
  player,
}: {
  defaultGame: GameDomain.GameEntity;
  player: GameDomain.PlayerEntity;
}) => {
  const { game = defaultGame, step } = useGame(defaultGame.id, player);

  if (!game) {
    return <GameLayout status={"Загрузка..."} />;
  }

  return (
    <GameLayout
      players={<GamePlayers game={game} />}
      status={<GameStatus game={game} />}
      field={<GameField game={game} onCellClick={step} />}
      exit={<ExitButton gameStatus={game.status} />}
    />
  );
};
