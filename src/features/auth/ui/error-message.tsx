import { Alert, AlertDescription } from "@/shared/ui/alert";

/**
 * Компонент сообщения об ошибке.
 * @component
 * @param {Object} props
 * @param {string} props.error - Ошибка.
 * @returns {React.ReactNode}
 */
export function ErrorMessage({ error }: { error?: string }): React.ReactNode {
  if (error) {
    return (
      <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  return null;
}
