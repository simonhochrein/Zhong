import { useEffect } from "react";
import { worker } from "./sharedWorker";

// export class Alarm {
//   constructor() {}
//   static instance = new Alarm();
// }

export const useAlarmTick = (cb) => {
  useEffect(() => {
    worker.addEventListener("message", (ev) => {
      cb(ev.data);
    });
  }, []);
};
