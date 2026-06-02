import React from "react";
import { Button } from "@/shared/ui/button";

/**
 * Компонент кнопки для отправки формы.
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Текст кнопки.
 * @param {boolean} props.isPending - Загрузка.
 * @returns {React.ReactNode}
 */
export function SubmitButton({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending: boolean;
}): React.ReactNode {
  return (
    <Button
      type="submit"
      className="w-full hover:cursor-pointer"
      disabled={isPending}
    >
      {children}
    </Button>
  );
}
