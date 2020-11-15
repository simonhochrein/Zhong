/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { Button, H1 } from "@blueprintjs/core";
import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
import { Progress } from "../Components/Progress";
import { getMinTime } from "../Lib/timeUtil";
import { ITimerState, TimerService } from "../Lib/TimerService";

import { ipcRenderer } from "electron";

const TIMER_CONTAINER = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

const TIMER_SETUP = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 1;
`;

const TIMER_START = css`
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const padNumber = (num: number) => num.toString().padStart(2, "0");

export class Timer extends React.Component {
  state = {
    selectedDuration: 0,
    duration: TimerService.instance.duration,
    current: TimerService.instance.current,
    running: TimerService.instance.state == ITimerState.Running,
  };
  startCallback = (duration) => this.setState({ duration });
  tickCallback = (current) => {
    this.setState({ current: current });
  };
  doneCallback = (cancelled) => {
    if(!cancelled) {
      ipcRenderer.send("alert");
    }
    this.setState({ duration: -1, current: 0 });
  };
  stateCallback = (state) => {
    this.setState({ running: state == ITimerState.Running });
  };
  startTimer() {
    if (this.state.selectedDuration > 0) {
      TimerService.instance.start(this.state.selectedDuration / 1000);
    }
  }
  onChange = (newTime: Date) => {
    this.setState({ selectedDuration: newTime.getTime() - getMinTime() });
  };
  reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    TimerService.instance.reset();
  }

  formatTimeLeft() {
    let duration = this.state.duration - this.state.current;
    let hours = Math.floor(duration / 3600);
    duration -= hours * 3600;
    let minutes = Math.floor(duration / 60);
    duration -= minutes * 60;
    let seconds = duration;

    if (duration >= 3600) {
      return hours + ":" + padNumber(minutes) + ":" + padNumber(seconds);
    } else {
      return padNumber(minutes) + ":" + padNumber(seconds);
    }
  }
  componentDidMount() {
    TimerService.instance.on("tick", this.tickCallback);
    TimerService.instance.on("start", this.startCallback);
    TimerService.instance.on("done", this.doneCallback);
    TimerService.instance.on("state", this.stateCallback);
  }
  componentWillUnmount() {
    TimerService.instance.off("tick", this.tickCallback);
    TimerService.instance.off("start", this.startCallback);
    TimerService.instance.off("done", this.tickCallback);
    TimerService.instance.off("state", this.stateCallback);
  }
  render() {
    if (this.state.duration > -1) {
      return (
        <div
          css={TIMER_CONTAINER}
          onClick={() => {
            TimerService.instance.toggle();
          }}
        >
          <Progress
            progress={this.state.current / this.state.duration}
            active={this.state.running}
          >
            <H1>{this.formatTimeLeft()}</H1>
            {!this.state.running && (
              <Button icon="reset" outlined intent="warning" onClick={this.reset} />
            )}
          </Progress>
        </div>
      );
    } else {
      return (
        <div css={TIMER_SETUP}>
          <div css={TIMER_START}>
            <TimePicker
              selectAllOnFocus
              autoFocus
              showArrowButtons
              precision={TimePrecision.SECOND}
              onChange={this.onChange}
            />
            <Button
              intent={"success"}
              onClick={() => this.startTimer()}
              fill
              large
              className="start"
              outlined
            >
              Start New Timer
            </Button>
          </div>
        </div>
      );
    }
  }
}
