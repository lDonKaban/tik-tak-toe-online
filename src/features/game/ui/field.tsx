"use client";

import { GameDomain } from "@/entities/game";

/**
 * Компонент игрового поля.
 * @component
 * @param {GameDomain.GameEntity} game - игра.
 * @param {function} onCellClick - обработчик клика на ячейку.
 * @returns {React.ReactNode} - JSX-узел.
 */
export const GameField = ({
  game,
  onCellClick,
}: {
  game: GameDomain.GameEntity;
  onCellClick?: (index: number) => void;
}) => {
  return (
    <div className="grid grid-cols-3">
      {game.field.map((symbol, index) => {
        return (
          <button
            key={index}
            className="border border-primary w-10 h-10 justify-center items-center cursor-pointer hover:border-emerald-300"
            onClick={() => onCellClick?.(index)}
          >
            {symbol ?? ""}
          </button>
        );
      })}
    </div>
  );
};
