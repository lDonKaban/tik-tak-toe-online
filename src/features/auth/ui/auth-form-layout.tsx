import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";

/**
 * Компонент макета формы авторизации.
 * @component
 * @param {Object} props
 * @param {string} props.title - Заголовок формы.
 * @param {string} props.description - Описание формы.
 * @param {React.ReactNode} props.fields - Поля формы.
 * @param {React.ReactNode} props.actions - Действия формы.
 * @param {React.ReactNode} props.link - Ссылка на страницу регистрации.
 * @param {React.ReactNode} props.error - Сообщение об ошибке.
 * @param {(formData: FormData) => void} props.action - Обработчик формы.
 * @returns {React.ReactNode}
 */
export function AuthFormLayout({
  title,
  description,
  fields,
  actions,
  link,
  error,
  action,
}: {
  title: string;
  description: string;
  fields: React.ReactNode;
  actions: React.ReactNode;
  link: React.ReactNode;
  error: React.ReactNode;
  action: (formData: FormData) => void;
}): React.ReactNode {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle className="font-bold text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <form action={action} className="space-y-4">
          {error}

          {fields}

          {actions}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">{link}</CardFooter>
    </Card>
  );
}
