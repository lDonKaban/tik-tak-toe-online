import { userRepository } from "../repositories/user";
import { sessionService } from "./session";

/**
 * Возвращает текущего пользователя.
 * @returns {Promise<UserEntity | undefined>} Текущий пользователь или undefined, если не найден.
 */
export const getCurrentUser = async () => {
  const { session } = await sessionService.verifySession();
  return userRepository.getUser({ id: session.id });
};
