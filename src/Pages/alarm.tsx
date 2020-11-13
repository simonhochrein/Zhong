import { Switch } from "@blueprintjs/core";
import { TimePicker } from "@blueprintjs/datetime";
import React, { useCallback, useState } from "react";
import { useAlarmTick } from "../Lib/alarm";

export function Alarm() {
  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(0);
  useAlarmTick(({ data }) => {
    let done = true;
    setTime(data);
    if (!done) {
      const now = new Date(data);
      if (now.getMinutes() == 8 && now.getHours() == 17) {
        done = true;
        alert('');
      }
    }
  });
  const onChange = useCallback((e: Date) => {
    console.log(e.getHours(), e.getMinutes());
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flexGrow: 1 }}>
        {new Date(time).toISOString()}
        <TimePicker onChange={onChange} />
      </div>
      <div style={{ flexShrink: 1, justifyContent: "center" }}>
        <Switch label={"Enable Alarm"} />
      </div>
    </div>
  );
}
