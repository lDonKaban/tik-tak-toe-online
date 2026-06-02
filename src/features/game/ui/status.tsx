import { GameDomain } from "@/entities/game";

/**
 * Компонент отображения статуса игры.
 * @component
 * @param {GameDomain.GameEntity} game - сущность игры.
 * @returns {React.ReactNode} - JSX-узел.
 */
export const GameStatus = ({ game }: { game: GameDomain.GameEntity }) => {
  switch (game.status) {
    case "idle":
      return <div className="text-lg">Ожидание игры</div>;
    case "inProgress": {
      const currentSymbol = GameDomain.getGameCurrentSymbol(game);
      return <div className="text-lg">Ход: {currentSymbol}</div>;
    }
    case "gameOver": {
      const currentSymbol = GameDomain.getPlayerSymbol(game.winner, game);
      return <div className="text-lg">Победитель: {currentSymbol}</div>;
    }
    case "gameOverDraw":
      return <div className="text-lg">Ничья</div>;
  }
};
