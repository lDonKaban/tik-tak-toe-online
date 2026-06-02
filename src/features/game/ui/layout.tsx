import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

/**
 * Компонент начальной страницы.
 * @component
 * @param {React.ReactNode} status - статус игры.
 * @param {React.ReactNode} field - игровое поле.
 * @param {React.ReactNode} players - игроки.
 * @returns {React.ReactNode} - JSX-узел.
 */
export const GameLayout = ({
  status,
  field,
  players,
  exit,
}: {
  status?: React.ReactNode;
  field?: React.ReactNode;
  players?: React.ReactNode;
  exit?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>Крестики нолики 3х3</CardTitle>
        {exit}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {players}
        {status}
        <div className="flex items-center justify-center">{field}</div>
      </CardContent>
    </Card>
  );
};
