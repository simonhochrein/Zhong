import { EventEmitter } from "events";

export class StopWatch extends EventEmitter {
    private _offset = 0;
    private _time = 0;
    private _start = 0;
    private _running = false;

    constructor() {
        super();
        setInterval(() => {
            if(this._running) {
                this._time = this._offset + Date.now() - this._start;
                this.emit('tick', this._time);
            }
        }, 10);
    }

    get running() {
        return this._running;
    }
    get time() {
        return this._time;
    }

    start() {
        this._start = Date.now();
        this._running = true;
        this.emit('state', true);
    }

    stop() {
        this._running = false;
        this._offset = this._time;
        this.emit('state', false);
    }

    reset() {
        this._offset = 0;
        this._time = 0;
        this._start = 0;
        this._running = false;
        this.emit('tick', 0);
        this.emit('state', false);
    }

    static instance = new StopWatch();
}