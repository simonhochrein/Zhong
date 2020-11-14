import { IWorkerMessage } from "./IWorkerMessage";

let running = false;
let ticks = 0;
let duration = 0;

setInterval(() => {
  if (running) {
    ticks++;

    postMessage({
      type: "tick",
      data: ticks,
    });

    if (ticks == duration) {
      postMessage({
        type: "done",
      });
      running = false;
    }
  }
}, 1000);

self.addEventListener(
  "message",
  ({ data: { data, type } }: MessageEvent<IWorkerMessage>) => {
    console.log(type, data);
    switch (type) {
      case "start":
        ticks = 0;
        duration = data;
        running = true;
        break;
      case "pause":
        running = false;
        break;
      case "resume":
        running = true;
        break;
    }
  }
);
