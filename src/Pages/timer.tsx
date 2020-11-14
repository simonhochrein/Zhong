/** @jsx jsx */
import React from "react";
import {jsx, css} from '@emotion/react';
import { Button, H1 } from "@blueprintjs/core";
import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
import { Progress } from "../Components/Progress";
import { getMinTime } from "../Lib/timeUtil";
import { Timer as TimerClass } from "../Lib/timer";

import { ipcRenderer } from "electron";

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
    duration: TimerClass.instance.duration,
    current: TimerClass.instance.current,
  };
  startCallback = (duration) => this.setState({ duration });
  tickCallback = (current) => {
    this.setState({ current: current });
  };
  doneCallback = () => {
    this.setState({ duration: -1, current: 0 });
    ipcRenderer.send("alert");
  };
  startTimer() {
    if (this.state.selectedDuration > 0) {
      TimerClass.instance.start(this.state.selectedDuration / 1000);
    }
  }
  onChange = (newTime: Date) => {
    this.setState({ selectedDuration: newTime.getTime() - getMinTime() });
  };

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
    TimerClass.instance.on("tick", this.tickCallback);
    TimerClass.instance.on("start", this.startCallback);
    TimerClass.instance.on("done", this.doneCallback);
  }
  componentWillUnmount() {
    TimerClass.instance.off("tick", this.tickCallback);
    TimerClass.instance.off("start", this.startCallback);
    TimerClass.instance.off("done", this.tickCallback);
  }
  render() {
    if (this.state.duration > -1) {
      return (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
          onClick={() => {
            TimerClass.instance.toggle();
          }}
        >
          <div style={{ flex: 1 }}></div>
          <Progress progress={this.state.current / this.state.duration}>
            <H1>{this.formatTimeLeft()}</H1>
          </Progress>
          <div
            style={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              alignContent: "center",
            }}
          >
          </div>
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