import { useState, useEffect } from "react";

export const useEventsSource = <T>(url: string, onData?: (data: T) => void) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown | undefined>();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const gameEvents = new EventSource(url);

    gameEvents.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data);
        setError(undefined);
        setData(data);
        onData?.(data);
        setIsPending(false);
      } catch (e) {
        setError(e);
        console.error("event parse error");
      }
    });

    gameEvents.addEventListener("error", (e) => {
      setError(e);
    });

    return () => {
      gameEvents.close();
    };
  }, [url]);

  return { dataStream: data, error, isPending };
};
