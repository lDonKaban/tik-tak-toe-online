"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { sessionService, verifyUserPassword } from "@/entities/user/server";

export interface SignInFormState {
  formData?: FormData;
  errors?: {
    login?: string;
    password?: string;
    _errors?: string;
  };
}

/**
 * Действие для регистрации пользователя.
 * @param state - состояние формы.
 * @param formData - данные формы.
 * @returns Результат регистрации.
 */
const formDataSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(3),
});

/**
 * Функция для преобразования данных формы в объект.
 * @param formData - данные формы.
 * @returns Объект данных формы.
 */
export const signInAction = async (
  state: unknown,
  formData: FormData,
): Promise<SignInFormState> => {
  const data = Object.fromEntries(formData.entries());

  const result = formDataSchema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.format();
    return {
      formData,
      errors: {
        login: formattedErrors.login?._errors.join(", "),
        password: formattedErrors.password?._errors.join(", "),
        _errors: formattedErrors._errors?.join(", "),
      },
    };
  }

  const verifyUserResult = await verifyUserPassword(result.data);

  if (verifyUserResult.type === "right") {
    await sessionService.addSession(verifyUserResult.value);

    redirect("/");
  }

  const errors = {
    "wrong-login-or-password": "Неверный логин или пароль",
  }[verifyUserResult.error];

  return {
    formData,
    errors: {
      _errors: errors,
    },
  };
};
