"use client";

import { useActionState } from "@/shared/lib/react";
import { routes } from "@/kernel/routes";
import { AuthFormLayout } from "../ui/auth-form-layout";
import AuthFields from "../ui/fields";
import { SubmitButton } from "../ui/submit-button";
import { BottomLink } from "../ui/bottom-link";
import { ErrorMessage } from "../ui/error-message";
import { signInAction } from "../action/sign-in";
import type { SignInFormState } from "../action/sign-in";

/**
 * Форма входа.
 * @component
 * @param {SignInFormState} formState - состояние формы.
 * @param {Function} action - функция обработки формы.
 * @param {boolean} isPending - состояние загрузки.
 * @returns {React.ReactNode} - JSX-узел.
 */
export function SignInForm() {
  const [formState, action, isPending] = useActionState(
    signInAction,
    {} as SignInFormState,
  );
  return (
    <AuthFormLayout
      title="Вход"
      description="Войдите в аккаунт, чтобы продолжить"
      action={action}
      fields={<AuthFields {...formState} />}
      actions={<SubmitButton isPending={isPending}>Войти</SubmitButton>}
      error={<ErrorMessage error={formState.errors?._errors} />}
      link={
        <BottomLink
          text="Нет аккаунта?"
          linkText="Зарегистрироваться"
          url={routes.signUp()}
        />
      }
    />
  );
}
