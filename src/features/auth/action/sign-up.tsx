"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createUser, sessionService } from "@/entities/user/server";

export interface SignUpFormState {
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
export const signUpAction = async (
  state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> => {
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

  const createUserResult = await createUser(result.data);

  if (createUserResult.type === "right") {
    await sessionService.addSession(createUserResult.value);

    redirect("/");
  }

  const errors = {
    "user-login-exists": "Пользователь с таким логином уже существует",
  }[createUserResult.error];

  return {
    formData,
    errors: {
      _errors: errors,
    },
  };
};
