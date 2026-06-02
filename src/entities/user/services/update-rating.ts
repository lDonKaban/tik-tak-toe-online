import type { UserEntity } from "../domain";
import { userRepository } from "../repositories/user";

/** Константа для коэффициента рейтинга.*/
const K = 48;

/**
 * Вычисляет ожидаемый результат для игрока A против игрока B.
 * Возвращает число от 0 до 1.
 * @param ratingA - рейтинг игрока A.
 * @param ratingB - рейтинг игрока B.
 */
const expectedScore = (ratingA: number, ratingB: number) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

export const updateRating = async ({
  players,
  winnerId,
}: {
  players: [
    Pick<UserEntity, "id" | "login" | "rating">,
    Pick<UserEntity, "id" | "login" | "rating">,
  ];
  winnerId: string | null;
}) => {
  const [playerA, playerB] = players;

  // Ничья: рейтинг теряет только тот игрок, чей рейтинг выше
  // Если рейтинги равны, то никто не теряет рейтинг
  if (winnerId === null) {
    const higher: Pick<UserEntity, "id" | "login" | "rating"> | null =
      playerA.rating > playerB.rating
        ? playerA
        : playerB.rating > playerA.rating
          ? playerB
          : null;

    if (higher) {
      const lower = higher.id === playerA.id ? playerB : playerA;
      const expected = expectedScore(higher.rating, lower.rating);
      const newRating = higher.rating + K * (0.5 - expected);
      await userRepository.updateUserRating(newRating, higher.id);
    }
    return;
  }

  const winner = players.find((player) => player.id === winnerId)!;
  const loser = players.find((player) => player.id !== winnerId)!;

  const expectedWinner = expectedScore(winner?.rating, loser?.rating);

  const newWinnerRating = winner.rating + K * (1 - expectedWinner);
  const newLoserRating = loser.rating + K * (0 - (1 - expectedWinner));

  await userRepository.updateUserRating(newWinnerRating, winner.id);
  await userRepository.updateUserRating(newLoserRating, loser.id);
};
