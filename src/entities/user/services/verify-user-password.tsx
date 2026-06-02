import { left, right } from "@/shared/lib/either";
import { userRepository } from "../repositories/user";
import { passwordService } from "./password";

/**
 * Проверяет пароль пользователя.
 * @param login - Логин пользователя.
 * @param password - Пароль пользователя.
 * @returns {Promise<Either<"wrong-login-or-password", UserEntity>>} Результат проверки пароля.
 */
export const verifyUserPassword = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}) => {
  const user = await userRepository.getUser({ login });

  if (!user) {
    return left("wrong-login-or-password");
  }
  const isCompare = await passwordService.comparePasswords({
    hash: user.passwordHash,
    salt: user.salt,
    password,
  });

  if (!isCompare) {
    return left("wrong-login-or-password");
  }

  return right(user);
};
