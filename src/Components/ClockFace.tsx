import { Colors, ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";
import { TimezonePicker } from "@blueprintjs/timezone";
import moment from "moment";
import React, { useState } from "react";
import { useInterval } from "../Lib/useInterval";

interface IClockFaceProps {
  timezone: string;
  style?: any;
  onRemove: (zone) => void;
}

interface IClockFaceState {
  hours: number;
  minutes: number;
}

@ContextMenuTarget
export class ClockFace extends React.Component<
  IClockFaceProps,
  IClockFaceState
> {
  state = {
    hours: 0,
    minutes: 0,
  };
  componentDidMount() {
    setInterval(() => {
      const dateTime = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: this.props.timezone,
        })
      );
      this.setState({
        hours: dateTime.getHours(),
        minutes: dateTime.getMinutes(),
      });
    }, 100);
  }

  deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }
  render() {
    const { hours, minutes } = this.state;
    const { timezone, style } = this.props;

    const hr = 15;
    const hx = hr * Math.cos(this.deg2rad((hours % 12) * 30 - 90));
    const hy = hr * Math.sin(this.deg2rad((hours % 12) * 30 - 90));

    const mr = 25;
    const mx = mr * Math.cos(this.deg2rad(minutes * 6 - 90));
    const my = mr * Math.sin(this.deg2rad(minutes * 6 - 90));

    // const fill = (hours >= 18 || hours <= 6) ? Colors.BLACK : Colors.WHITE;
    console.log(moment.tz(timezone));
    return (
      <div style={{ flex: 1, ...(style ? style : {}) }}>
        <svg viewBox="0 0 80 120" width={80} height={120} color={Colors.WHITE}>
          <circle
            fill="none"
            cx={40}
            cy={40}
            r={30}
            stroke="currentcolor"
            strokeWidth={2}
          ></circle>
          <line
            x1={40}
            y1={40}
            x2={hx + 40}
            y2={hy + 40}
            stroke="currentcolor"
            strokeWidth={2}
            strokeLinecap={"round"}
          ></line>
          <line
            x1={40}
            y1={40}
            x2={mx + 40}
            y2={my + 40}
            stroke="currentcolor"
            strokeWidth={2}
            strokeLinecap={"round"}
          ></line>
          <text
            x={40}
            y={88}
            stroke={"none"}
            fill={"currentcolor"}
            width={80}
            height={20}
            textAnchor={"middle"}
          >
            {hours % 12}:{minutes.toString().padStart(2, "0")}{" "}
            {hours >= 12 ? "PM" : "AM"}
          </text>
          <text
            x={40}
            y={108}
            stroke={"none"}
            fill={"currentcolor"}
            width={80}
            height={20}
            textAnchor={"middle"}
            fontSize={10}
          >
            {moment.tz(timezone).zoneName()}
          </text>
        </svg>
      </div>
    );
  }

  renderContextMenu() {
    return (
      <Menu>
        <MenuItem text="Edit" icon='edit' />
        <MenuItem text="Delete" icon='trash' onClick={() => this.props.onRemove(this.props.timezone)} />
      </Menu>
    )
  }

  onContextMenuClose() {

  }
}
