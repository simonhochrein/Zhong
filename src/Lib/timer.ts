import { EventEmitter } from "events";
import { IWorkerMessage } from "./IWorkerMessage";
import { worker } from "./sharedWorker";

export enum ITimerState {
  Stopped,
  Running,
  Paused,
}

export class Timer extends EventEmitter {
  public duration = -1;
  public current = 0;
  public state = ITimerState.Paused;

  /**
   *
   * @param time Time in milliseconds
   */
  constructor() {
    super();
    worker.addEventListener("message", this.onMessage.bind(this));
  }

  private onMessage({ data: { type, data } }: MessageEvent<IWorkerMessage>) {
    switch (type) {
      case "tick":
        this.tick(data);
        break;
      case "done":
        this.duration = -1;
        this.current = 0;
        this.state = ITimerState.Stopped;
        this.emit("done");
        break;
    }
  }

  tick(currentTicks) {
    this.current = currentTicks;
    this.emit("tick", currentTicks);
  }

  pause() {
    this.state = ITimerState.Paused;
    this.emit("state", this.state);
    worker.postMessage({
      type: "pause",
    });
  }
  resume() {
    this.state = ITimerState.Running;
    this.emit("state", this.state);
    worker.postMessage({
      type: "resume",
    });
  }

  toggle() {
    if (this.state == ITimerState.Paused) {
      this.resume();
    } else if (this.state == ITimerState.Running) {
      this.pause();
    }
  }

  reset() {
    worker.postMessage({
      type: "pause",
    });
    this.state = ITimerState.Stopped;
    this.emit("state", this.state);
    this.emit("done", true);
  }

  start(duration) {
    this.state = ITimerState.Running;
    this.emit("state", this.state);
    this.duration = duration;
    this.emit("start", duration);
    worker.postMessage({
      type: "start",
      data: duration,
    });
  }
  static instance = new Timer();
}
