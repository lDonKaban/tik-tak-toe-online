"use client";

import { useActionState } from "@/shared/lib/react";
import { AuthFormLayout } from "../ui/auth-form-layout";
import AuthFields from "../ui/fields";
import { SubmitButton } from "../ui/submit-button";
import { BottomLink } from "../ui/bottom-link";
import { ErrorMessage } from "../ui/error-message";
import { signUpAction } from "../action/sign-up";
import type { SignUpFormState } from "../action/sign-up";
import { routes } from "@/kernel/routes";

/**
 * Компонент формы регистрации.
 * @component
 * @returns {React.ReactNode}
 */
export function SignUpForm(): React.ReactNode {
  const [formState, action, isPending] = useActionState(
    signUpAction,
    {} as SignUpFormState,
  );

  return (
    <AuthFormLayout
      title="Регистрация"
      description="Создайте аккаунт, чтобы начать играть"
      fields={<AuthFields {...formState} />}
      action={action}
      actions={
        <SubmitButton isPending={isPending}>Зарегистрироваться</SubmitButton>
      }
      error={<ErrorMessage error={formState.errors?._errors} />}
      link={
        <BottomLink
          text="Уже есть аккаунт?"
          linkText="Войти"
          url={routes.signIn()}
        />
      }
    />
  );
}
