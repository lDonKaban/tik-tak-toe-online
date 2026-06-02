import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { right, left } from "@/shared/lib/either";
import { userToSession } from "../domain";
import type { SessionEntity, UserEntity } from "../domain";
import { routes } from "@/kernel/routes";

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set or empty. Add it to your .env.production file.",
    );
  }
  return new TextEncoder().encode(secret);
};

/**
 * Функция для шифрования данных сессии.
 * @param payload - данные сессии для шифрования.
 */
export const encrypt = async (payload: SessionEntity) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
};

/**
 * Функция для дешифрования данных сессии.
 * @param session - зашифрованная сессия для дешифрования.
 */
export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return right(payload as SessionEntity);
  } catch (error) {
    return left(error);
  }
};

/**
 * Функция для добавления сессии пользователя.
 * @param user - пользователь для добавления сессии.
 */
const addSession = async (user: UserEntity) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionData = userToSession(user, expiresAt.toISOString());
  const session = await encrypt(sessionData);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    // secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
};

/** Функция для удаления сессии пользователя. */
const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");
};

/**
 * Функция для проверки сессии пользователя.
 * @returns Объект с информацией о сессии.
 */
export const verifySession = async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session.type === "left") {
    redirect(routes.signIn());
  }

  return { isAuth: true, session: session.value };
};

export const sessionService = {
  addSession,
  deleteSession,
  verifySession,
};
