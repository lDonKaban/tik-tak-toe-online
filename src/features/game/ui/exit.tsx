import { redirect } from "next/navigation";
import { Button } from "@/shared/ui/button";

export const ExitButton = ({
  gameStatus,
}: {
  gameStatus: "inProgress" | "gameOverDraw" | "idle" | "gameOver";
}) => {
  const onExit = () => {
    redirect("/");
  };

  return (
    <Button
      className={
        gameStatus === "inProgress"
          ? "bg-amber-950 text-amber-50 cursor-pointer w-[69px]"
          : "bg-gray-800 text-amber-50 cursor-pointer w-[69px]"
      }
      onClick={onExit}
    >
      {gameStatus === "inProgress" ? "Сдаться" : "Выйти"}
    </Button>
  );
};
