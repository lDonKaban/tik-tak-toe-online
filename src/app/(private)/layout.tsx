import { redirect } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { sessionService, getCurrentUser } from "@/entities/user/server";
import { routes } from "@/kernel/routes";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await sessionService.verifySession();
  const result = await getCurrentUser();

  const logOut = async () => {
    "use server";

    await sessionService.deleteSession();
    redirect(routes.signIn());
  };

  return (
    <div className="flex flex-col grow">
      <header className="px-10 py-4 flex flex-row gap-4 justify-between border-b border-b-primary/50 items-center">
        <div className="text-xl">Tik-tak-toe-online</div>
        <div className="flex gap-4 items-center">
          <div className="text-lg">
            {session.login}{" "}
            <span className="text-gray-300 text-base">
              ({result?.rating ?? "?"})
            </span>
          </div>
          <form action={logOut}>
            <Button className="cursor-pointer">Выйти</Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
