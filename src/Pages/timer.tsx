import { H1 } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Progress } from "../Components/Progress";
import { useInterval } from "../Lib/useInterval";

const start = Date.now();
const then = 1 * 60 * 1000;

export function Timer() {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  useInterval(() => {
    const now = Date.now() - start;
    const p = 1 - (now / then);
    setProgress(p * 100);
    setSecondsLeft(Math.round((then - now) / 1000));
  });
  return (
    <Progress progress={progress}>
      <H1>
        {Math.floor(secondsLeft / 60)} :{" "}
        {(secondsLeft % 60).toString().padStart(2, "0")}
      </H1>
    </Progress>
  );
}
