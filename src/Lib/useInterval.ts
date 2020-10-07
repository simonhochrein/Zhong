import { useEffect } from "react";

export function useInterval(cb: () => void, interval?: number) {
    useEffect(() => {
        const _interval = setInterval(() => {
            cb();
        }, interval);
        return () => clearInterval(_interval);
      }, []);
}