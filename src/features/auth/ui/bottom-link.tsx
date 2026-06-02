import Link from "next/link";

/**
 * Компонент ссылки внизу формы.
 * @component
 * @param {Object} props
 * @param {string} props.text - Текст перед ссылкой.
 * @param {string} props.linkText - Текст ссылки.
 * @param {string} props.url - URL ссылки.
 * @returns {React.ReactNode}
 */
export function BottomLink({
  text,
  linkText,
  url,
}: {
  text: string;
  linkText: string;
  url: string;
}): React.ReactNode {
  return (
    <p className="text-sm text-muted-foreground">
      {text}{" "}
      <Link
        href={url}
        className="text-primary underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}
