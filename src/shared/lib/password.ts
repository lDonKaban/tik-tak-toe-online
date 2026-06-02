/**
 * Удаляет хеш пароля из данных.
 * @param data - Данные.
 * @returns {Omit<T, "passwordHash">} Данные без хеша пароля.
 */
export const removePassword = <T extends { passwordHash: string }>(
  data: T,
): Omit<T, "passwordHash"> => {
  const { passwordHash: _, ...rest } = data;
  return rest;
};
