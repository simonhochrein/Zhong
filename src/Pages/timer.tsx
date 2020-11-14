import { Button, H1, Icon } from "@blueprintjs/core";
import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
import React, { useEffect, useState } from "react";
import { Progress } from "../Components/Progress";
import { getMinTime } from "../Lib/timeUtil";

import { BrowserWindow } from "@electron/remote";
import { Timer as TimerClass } from "../Lib/timer";

import { ipcRenderer } from "electron";

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
    const duration = this.state.duration;
    let timeLeft = duration - this.state.current;
    let hours = 0;
    let minutes = 0;
    if (timeLeft >= 3600) {
      hours = (timeLeft - (timeLeft % 3600)) / 3600;
      timeLeft -= hours * 3600;
    }
    if (timeLeft >= 60) {
      minutes = (timeLeft - (timeLeft % 60)) / 60;
      timeLeft -= minutes * 60;
    }
    let seconds = timeLeft;

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
            {/* <Icon icon="pause" /> */}
          </div>
        </div>
      );
    } else {
      return (
        <div className={"timerDone"}>
          {/* <H1>Time's up!</H1> */}
          <div className="action">
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

// export function Timer() {
//   const [active, setActive] = useState(false);

//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     // if (!active) {
//     //   let w = BrowserWindow.getAllWindows()[0];
//     //   if (!w.isFocused()) {
//     //     w.hide();
//     //     w.show();
//     //   }
//     // }

//   }, []);

//   const onChange = (newTime: Date) => {
//     setDuration(newTime.getTime() - getMinTime());
//   };

//   const startTimer = () => {
//     // const now = Date.now();
//     // setStart(now);
//     // setEnd(now + duration);
//     // setActive(true);
//   };

//   if (progress > 0) {
//     return (

//     );
//   }
//   return (
//     <div className={"timerDone"}>
//       {/* <H1>Time's up!</H1> */}
//       <div className="action">
//         <TimePicker
//           selectAllOnFocus
//           autoFocus
//           showArrowButtons
//           precision={TimePrecision.SECOND}
//           onChange={onChange}
//         />
//         <Button
//           intent={"success"}
//           onClick={startTimer}
//           fill
//           large
//           className="start"
//         >
//           Start New Timer
//         </Button>
//       </div>
//     </div>
//   );
// }
