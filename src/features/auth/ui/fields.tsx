import { useId } from "react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";

/**
 * Компонент полей формы аутентификации.
 * @component
 * @returns {React.ReactNode}
 */
export default function AuthFields({
  formData,
  errors,
}: {
  formData?: FormData;
  errors?: {
    login?: string;
    password?: string;
  };
}): React.ReactNode {
  const loginId = useId();
  const passwordId = useId();
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={loginId}>Логин</Label>
        <Input
          id={loginId}
          name="login"
          type="login"
          placeholder="Введите логин"
          required
          defaultValue={formData?.get("login")?.toString()}
        />
        {errors?.login && <div>{errors.login}</div>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={passwordId}>Пароль</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          placeholder="Введите пароль"
          required
          defaultValue={formData?.get("password")?.toString()}
        />
        {errors?.password && <div>{errors.password}</div>}
      </div>
    </>
  );
}
