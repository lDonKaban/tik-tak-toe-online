/**
 * Основной макет для страницы со списком игр и кнопками.
 * @param children - Основное содержимое страницы.
 * @param actions - Элементы управления (кнопки, ссылки и т.д.).
 * @returns {React.ReactNode} Вернет JSX-разметку макета.
 */
export function Layout({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-start gap-4 w-1/2">{actions}</div>
      <div className="grid grid-cols-3 gap-4">{children}</div>
    </div>
  );
}
