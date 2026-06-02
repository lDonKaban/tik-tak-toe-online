export interface Left<L> {
  type: "left";
  error: L;
}

export interface Right<R> {
  type: "right";
  value: R;
}

export type Either<L, R> = Left<L> | Right<R>;

/**
 * Создает левый экземпляр Either.
 * @param error - Ошибка.
 * @returns {Left<L>} Левый экземпляр Either.
 */
export const left = <const L>(error: L): Left<L> => ({
  type: "left",
  error,
});

/**
 * Создает правый экземпляр Either.
 * @param value - Значение.
 * @returns {Right<R>} Правый экземпляр Either.
 */
export const right = <const R>(value: R): Right<R> => ({
  type: "right",
  value,
});

/**
 * Применяет функцию к правому значению Either.
 * @param either - Экземпляр Either.
 * @param fn - Функция.
 * @returns {Either<L, R2>} Результат применения функции к правому значению.
 */
export const mapRight = <R, R2, L = unknown>(
  either: Either<L, R>,
  fn: (value: R) => R2,
): Either<L, R2> => {
  if (either.type === "right") {
    return right(fn(either.value));
  }

  return either;
};

/**
 * Применяет функцию к левому значению Either.
 * @param either - Экземпляр Either.
 * @param fn - Функция.
 * @returns {Either<L2, R>} Результат применения функции к левому значению.
 */
export const mapLeft = <R, L, L2>(
  either: Either<L, R>,
  fn: (value: L) => L2,
): Either<L2, R> => {
  if (either.type === "left") {
    return left(fn(either.error));
  }

  return either;
};

/**
 * Выполняет сопоставление Either с функциями для левого и правого значений.
 * @param either - Экземпляр Either.
 * @param mathers - Объект с функциями для левого и правого значений.
 * @returns {V} Результат сопоставления.
 */
export const matchEither = <L, R, V>(
  either: Either<L, R>,
  mathers: {
    left: (error: L) => V;
    right: (value: R) => V;
  },
): V => {
  if (either.type === "left") {
    return mathers.left(either.error);
  }

  return mathers.right(either.value);
};
