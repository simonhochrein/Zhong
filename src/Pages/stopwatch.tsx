/** @jsx jsx */
import { Button, H1 } from "@blueprintjs/core";
import { jsx, css } from "@emotion/react";
import React, { useEffect, useState } from "react";

import { StopwatchService } from "../Lib/StopwatchService";

const CONTAINER = css`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const BUTTON_CONTAINER = css`
  padding-top: 20px;
  display: flex;
  flex-direction: row;
`;

const BUTTON = css`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export function StopWatch() {
  const [running, setRunning] = useState(StopwatchService.instance.running);
  const [time, setTime] = useState(StopwatchService.instance.time);

  useEffect(() => {
    const tickListener = (_time) => {
      setTime(_time);
    };
    const stateListener = (_running) => {
      setRunning(_running);
    };
    StopwatchService.instance.on("tick", tickListener);
    StopwatchService.instance.on("state", stateListener);
    return () => {
      StopwatchService.instance.off("tick", tickListener);
      StopwatchService.instance.off("state", stateListener);
    };
  }, [running]);

  const formatTime = (duration) => {
    const hours = Math.floor(duration / (3600 * 1000));
    duration -= hours * (3600 * 1000);
    const minutes = Math.floor(duration / (60 * 1000));
    duration -= minutes * (60 * 1000);
    const seconds = Math.floor(duration / 1000);
    duration -= seconds * 1000;
    const decisecond = Math.floor(duration / 100);
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${decisecond}`;
  };

  return (
    <div css={CONTAINER}>
      <div
        css={css`
          width: 100%;
          text-align: center;
        `}
      >
        <H1 className={"bp3-monospace-text"}>{formatTime(time)}</H1>
        <div css={BUTTON_CONTAINER}>
          <div css={BUTTON}>
            <Button
              outlined
              onClick={() => StopwatchService.instance.reset()}
              icon="reset"
              intent="warning"
              large
            />
          </div>
          <div css={BUTTON}>
            <Button
              outlined
              large
              intent="success"
              onClick={() =>
                running
                  ? StopwatchService.instance.stop()
                  : StopwatchService.instance.start()
              }
              icon={running ? "pause" : "play"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
