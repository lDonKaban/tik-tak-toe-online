import type { UserId } from "@/kernel/ids";

export interface UserEntity {
  id: UserId;
  login: string;
  rating: number;
  passwordHash: string;
  salt: string;
}

export type SessionEntity = {
  id: UserId;
  login: string;
  expiredAt: string;
};

export const DEFAULT_RATING = 1000;

/**
 * Функция для преобразования пользователя в сессию.
 * @param user - пользователь для преобразования.
 * @param expiredAt - дата истечения сессии.
 * @returns Объект сессии.
 */
export const userToSession = (
  user: UserEntity,
  expiredAt: string,
): SessionEntity => {
  return {
    id: user.id,
    login: user.login,
    expiredAt,
  };
};
