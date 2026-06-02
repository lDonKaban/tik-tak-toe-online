import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/shared/ui/card";

/**
 * Компонент карточки игры.
 * @component
 * @param login Логин игрока, с которым играет.
 * @param rating Рейтинг игрока, с которым играет.
 * @returns {React.ReactNode} Карточка игры
 */
export function GameCard({
  login,
  rating,
  actions,
}: {
  login: string;
  rating: number;
  actions: React.ReactNode;
}): React.ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Игра с: <span className="font-bold">{login}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        Рейтинг: <span className="font-bold">{rating}</span>
      </CardContent>
      <CardFooter>{actions}</CardFooter>
    </Card>
  );
}
