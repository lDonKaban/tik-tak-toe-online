import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/** Адрес подключения к БД */
const connectionString = `${process.env.DATABASE_URL}`;
/** Пул соединений с БД */
const pool = new Pool({ connectionString });

/** Адаптер для Prisma */
const adapter = new PrismaPg(pool);
/** Клиент Prisma */
const prisma = new PrismaClient({ adapter });

/** Создает тестовых пользователей и игры для демонстрации. */
async function main() {
  // const user1 = await prisma.user.create({
  //   data: {
  //     login: "player-1",
  //     rating: 1000,
  //     passwordHash: "123",
  //   },
  // });
  // const user2 = await prisma.user.create({
  //   data: {
  //     login: "player-2",
  //     rating: 800,
  //     passwordHash: "321",
  //   },
  // });
  // await prisma.game.create({
  //   data: {
  //     field: Array(9).fill(null),
  //     status: "idle",
  //     players: {
  //       connect: { id: user1.id },
  //     },
  //   },
  // });
  // await prisma.game.create({
  //   data: {
  //     field: Array(9).fill(null),
  //     status: "idle",
  //     players: {
  //       connect: { id: user2.id },
  //     },
  //   },
  // });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
