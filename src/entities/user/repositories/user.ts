import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/db";
import { UserEntity } from "../domain";

/**
 * Функция для сохранения пользователя в базе данных.
 * @param user - данные пользователя для сохранения.
 */
export const saveUser = (user: UserEntity): Promise<UserEntity> => {
  return prisma.user.upsert({
    where: { id: user.id },
    create: user,
    update: user,
  });
};

/**
 * Функция для получения пользователя из базы данных по условию.
 * @param where - условие для поиска пользователя.
 */
export const getUser = (where: Prisma.UserWhereInput) => {
  return prisma.user.findFirst({ where });
};

/**
 * Функция для обновления рейтинга пользователя в базе данных.
 * @param rating - новый рейтинг пользователя.
 * @param userId - идентификатор пользователя.
 */
export const updateUserRating = (rating: number, userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { rating: Math.round(rating) },
  });
};

export const userRepository = { saveUser, getUser, updateUserRating };
