import { z } from "zod";
import { Game, User, GamePlayer } from "@prisma/client";
import { prisma } from "@/shared/lib/db";
import type { Prisma } from "@prisma/client";
import type { GameId } from "@/kernel/ids";
import {
  GameEntity,
  GameIdleEntity,
  GameInProgressEntity,
  GameOverDrawEntity,
  GameOverEntity,
  PlayerEntity,
} from "../domain";

const gameInclude = {
  winner: { include: { user: true } },
  players: { include: { user: true } },
};

/**
 * Возвращает список игр, удовлетворяющих заданным условиям.
 * @param where - Условия фильтрации игр.
 * @returns {Promise<GameEntity[]>} Список игр.
 */
const gamesList = async (
  where?: Prisma.GameWhereInput,
): Promise<GameEntity[]> => {
  const games = await prisma.game.findMany({
    where,
    include: gameInclude,
  });

  return games.map(dbGameToGameEntity);
};

/**
 * Возвращает игру, удовлетворяющую заданным условиям.
 * @param where - Условия фильтрации игры.
 * @returns {Promise<GameEntity | undefined>} Игра или undefined, если не найдена.
 */
const getGame = async (
  where?: Prisma.GameWhereInput,
): Promise<GameEntity | undefined> => {
  const game = await prisma.game.findFirst({
    where,
    include: gameInclude,
  });

  if (game) {
    return dbGameToGameEntity(game);
  }

  return undefined;
};

/**
 * Создает новую игру.
 * @param game - Данные новой игры.
 * @returns {Promise<GameEntity>} Созданная игра.
 */
const createGame = async (game: GameIdleEntity): Promise<GameEntity> => {
  const createdGame = await prisma.game.create({
    data: {
      status: game.status,
      id: game.id,
      field: game.field,
      players: {
        create: {
          index: 0,
          userId: game.creator.id,
        },
      },
    },
    include: gameInclude,
  });

  return dbGameToGameEntity(createdGame);
};

/**
 * Начинает игру.
 * @param gameId - Идентификатор игры.
 * @param player - Игрок, который присоединяется к игре.
 * @returns {Promise<GameEntity>} Игра в процессе.
 */
const startGame = async (gameId: GameId, player: PlayerEntity) => {
  return dbGameToGameEntity(
    await prisma.game.update({
      where: { id: gameId },
      data: {
        players: {
          create: {
            index: 1,
            userId: player.id,
          },
        },
        status: "inProgress",
      },
      include: gameInclude,
    }),
  );
};

const saveGame = async (
  game: GameInProgressEntity | GameOverDrawEntity | GameOverEntity,
) => {
  const winnerId =
    game.status === "gameOver"
      ? await prisma.gamePlayer
          .findFirstOrThrow({ where: { userId: game.winner.id } })
          .then((p) => p.id)
      : undefined;
  return dbGameToGameEntity(
    await prisma.game.update({
      where: { id: game.id },
      data: {
        status: game.status,
        field: game.field,
        winnerId: winnerId,
      },
      include: gameInclude,
    }),
  );
};

/**
 * Схема валидации поля игры.
 * @type {z.ZodType}
 */
const fieldSchema = z.array(z.union([z.string(), z.null()]));

/**
 * Преобразует данные из базы данных в сущность игры.
 * @param game - Данные игры из базы данных.
 * @returns {GameEntity} Преобразованная игра.
 */
const dbGameToGameEntity = (
  game: Game & {
    players: Array<GamePlayer & { user: User }>;
    winner?: (GamePlayer & { user: User }) | null;
  },
): GameEntity => {
  const players = game.players
    .sort((a, b) => a.index - b.index)
    .map(dbPlayerToPlayer);
  switch (game.status) {
    case "idle": {
      const [creator] = players;
      if (!creator) {
        throw new Error("creator should be in game idle");
      }
      return {
        id: game.id,
        creator: creator,
        status: game.status,
        field: fieldSchema.parse(game.field),
      } satisfies GameIdleEntity;
    }
    case "inProgress":
    case "gameOverDraw":
      return {
        id: game.id,
        players: players,
        field: fieldSchema.parse(game.field),
        status: game.status,
      };
    case "gameOver":
      if (!game.winner) {
        throw new Error("winner should be in game over");
      }

      return {
        id: game.id,
        players: players,
        field: fieldSchema.parse(game.field),
        status: game.status,
        winner: dbPlayerToPlayer(game.winner),
      } satisfies GameOverEntity;
  }
};

export const dbPlayerToPlayer = (
  db: GamePlayer & { user: User },
): PlayerEntity => {
  return {
    id: db.user.id,
    login: db.user.login,
    rating: db.user.rating,
  };
};

/**
 * Репозиторий игр.
 * @type {Object}
 */
export const gameRepository = {
  gamesList,
  createGame,
  getGame,
  startGame,
  saveGame,
};
