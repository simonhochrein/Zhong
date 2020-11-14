import { Colors, ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";
import { css, cx } from "emotion";
import React from "react";

interface IClockFaceProps {
  timezone: string;
  style?: any;
  onRemove(zone: string): void;
  onEdit(): void;
}

interface IClockFaceState {
  hours: number;
  minutes: number;
  active: boolean;
}

const CLOCKFACE = css`
  flex-shrink: 1;
  padding: 2px;
  margin: 2px;
  border-radius: 12px;
  transition: background 200ms ease-in-out;
  :hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CLOCKFACE_ACTIVE = css`
  background: rgba(255, 255, 255, 0.1);
`;

@ContextMenuTarget
export class ClockFace extends React.Component<
  IClockFaceProps,
  IClockFaceState
> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.currentTime(),
      active: false,
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState(this.currentTime());
    }, 100);
  }

  currentTime() {
    const dateTime = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: this.props.timezone,
      })
    );
    return {
      hours: dateTime.getHours(),
      minutes: dateTime.getMinutes(),
    };
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
    return (
      <div
        style={{ ...(style ? style : {}) }}
        className={cx(CLOCKFACE, { [CLOCKFACE_ACTIVE]: this.state.active })}
        onClick={(e) => e.target.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, clientX: e.clientX, clientY: e.clientY}))}
      >
        <svg viewBox="0 0 80 120" width={80} height={120} color={Colors.WHITE} style={{pointerEvents: 'none'}}>
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
            {timezone.split("/").slice(-1)[0].replace(/_/g, " ")}
          </text>
        </svg>
      </div>
    );
  }

  renderContextMenu() {
    this.setState({ active: true });
    return (
      <Menu>
        <MenuItem
          text="Edit Timezones"
          icon="edit"
          onClick={() => this.props.onEdit()}
        />
        <MenuItem
          text="Delete"
          icon="trash"
          onClick={() => this.props.onRemove(this.props.timezone)}
        />
      </Menu>
    );
  }

  onContextMenuClose = () => {
    this.setState({ active: false });
  };
}
