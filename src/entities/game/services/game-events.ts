import { GameDomain } from "@/entities/game";
import { GameId } from "@/kernel/ids";
import { EventChannel } from "@/shared/lib/events";

/** Сервис для управления событиями игры. */
class GameEventsService {
  eventsChannel = new EventChannel("game");

  addGameChangedListener(
    gameId: GameId,
    listener: (event: GameChanged) => void,
  ) {
    return this.eventsChannel.consume(gameId, (data) => {
      listener(data as GameChanged);
    });
  }

  addGameCreatedListener(listener: (event: GameCreated) => void) {
    return this.eventsChannel.consume("game-created", (data) => {
      listener(data as GameCreated);
    });
  }

  emit(event: GameEvent) {
    if (event.type === "game-changed") {
      return this.eventsChannel.emit(event.data.id, event);
    }

    if (event.type === "game-created") {
      return this.eventsChannel.emit("game-created", event);
    }
  }
}

type GameEvent = GameChanged | GameCreated;

type GameChanged = {
  type: "game-changed";
  data: GameDomain.GameEntity;
};

type GameCreated = {
  type: "game-created";
};

export const gameEvents = new GameEventsService();
