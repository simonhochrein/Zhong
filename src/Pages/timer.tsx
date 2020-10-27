import { Button, H1, Icon } from "@blueprintjs/core";
import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
import React, { useEffect, useState } from "react";
import { Progress } from "../Components/Progress";
import { getMinTime } from "../Lib/timeUtil";

import { BrowserWindow } from "@electron/remote";

export function Timer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!active) {
      let w = BrowserWindow.getAllWindows()[0];
      if (!w.isFocused()) {
        w.hide();
        w.show();
      }
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (end >= now) {
        setTimeLeft(end - now);
        setProgress(100 - (100 * (now - start)) / (end - start));
      } else {
        setActive(false);
        setProgress(0);
      }
    }, 10);

    return () => clearInterval(interval);
  });

  const onChange = (newTime: Date) => {
    setDuration(newTime.getTime() - getMinTime());
  };

  const startTimer = () => {
    const now = Date.now();
    setStart(now);
    setEnd(now + duration);
    setActive(true);
  };

  if (progress > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1 }}></div>
        <Progress progress={progress}>
          <H1>
            {Math.floor(Math.ceil(timeLeft / 1000) / 60)} :{" "}
            {(Math.floor(Math.ceil(timeLeft / 1000)) % 60)
              .toString()
              .padStart(2, "0")}
          </H1>
        </Progress>
        <div
          style={{
            flex: 1,
            justifyContent: "center",
            display: "flex",
            alignContent: "center",
          }}
        >
          <Icon icon="pause" />
        </div>
      </div>
    );
  }
  return (
    <div className={"timerDone"}>
      <H1>Time's up!</H1>
      <div className="action">
        <TimePicker
        selectAllOnFocus
          autoFocus
          showArrowButtons
          precision={TimePrecision.SECOND}
          onChange={onChange}
        />
        <Button
          intent={"success"}
          onClick={startTimer}
          fill
          large
          className="start"
        >
          Start New Timer
        </Button>
      </div>
    </div>
  );
}
