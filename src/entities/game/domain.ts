import type { UserId, GameId } from "@/kernel/ids";
import { left, right } from "@/shared/lib/either";

export type GameEntity =
  | GameIdleEntity
  | GameInProgressEntity
  | GameOverEntity
  | GameOverDrawEntity;

export interface GameIdleEntity {
  id: GameId;
  creator: PlayerEntity;
  status: "idle";
  field: Field;
}

export interface GameInProgressEntity {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "inProgress";
}

export interface GameOverEntity {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "gameOver";
  winner: PlayerEntity;
}

export interface GameOverDrawEntity {
  id: GameId;
  players: PlayerEntity[];
  field: Field;
  status: "gameOverDraw";
}

export interface PlayerEntity {
  id: UserId;
  login: string;
  rating: number;
}

export const GameSymbols = {
  X: "X",
  O: "O",
};

export type Field = Cell[];

export type Cell = GameSymbol | null;
export type GameSymbol = string;

export const getGameCurrentSymbol = (
  game: GameInProgressEntity | GameOverEntity | GameOverDrawEntity,
) => {
  const countSymbolsOnField = game.field.filter(
    (symbol) => symbol !== null,
  ).length;

  return countSymbolsOnField % 2 === 0 ? GameSymbols.X : GameSymbols.O;
};

export const getNextSymbol = (currentSymbol: GameSymbol) => {
  return currentSymbol === GameSymbols.X ? GameSymbols.O : GameSymbols.X;
};

export const getPlayerSymbol = (
  player: PlayerEntity,
  game: GameInProgressEntity | GameOverEntity,
) => {
  const index = game.players.findIndex((p) => p.id === player.id);

  return { 0: GameSymbols.X, 1: GameSymbols.O }[index];
};

export const doStep = ({
  game,
  player,
  cellIndex,
}: {
  game: GameInProgressEntity;
  player: PlayerEntity;
  cellIndex: number;
}) => {
  const currentSymbol = getGameCurrentSymbol(game);

  if (currentSymbol !== getPlayerSymbol(player, game)) {
    console.log("currentSymbol =", currentSymbol);
    console.log(
      "getPlayerSymbol(player, game) =",
      getPlayerSymbol(player, game),
    );
    return left("not-player-symbol");
  }

  if (game.field[cellIndex]) {
    return left("game-cell-already-has-symbol");
  }

  const newField: Field = game.field.map((cell, i) => {
    return i === cellIndex ? currentSymbol : cell;
  });

  if (calculateWinner(newField)) {
    return right({
      ...game,
      winner: player,
      field: newField,
      status: "gameOver",
    } satisfies GameOverEntity);
  }

  if (isDraw(newField)) {
    return right({
      ...game,
      field: newField,
      status: "gameOverDraw",
    } satisfies GameOverDrawEntity);
  }

  return right({
    ...game,
    field: newField,
  });
};

const isDraw = (squares: Field) => {
  const winner = calculateWinner(squares);

  if (!winner) {
    return squares.every(Boolean);
  }

  return false;
};

const calculateWinner = (squares: Field) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};
