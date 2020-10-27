import { useEffect } from "react";

export function useInterval(cb: () => void, interval?: number) {
    let _interval;
    useEffect(() => {
        _interval = setInterval(() => {
            cb();
        }, interval);
        return () => clearInterval(_interval);
      });
    return {
        cancel: () => {
            clearInterval(_interval);
        }
    };
}