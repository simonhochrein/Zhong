/** @jsx jsx */
import { InputGroup, Menu, MenuItem, Button, Icon } from "@blueprintjs/core";
import moment from "moment";
import React from "react";
import { Popup } from "./Popup";
import Fuse from "fuse.js";
import ReactDOM from "react-dom";
import { jsx, css } from "@emotion/react";

const TIMEZONE_PICKER = css`
  height: 80%;
  overflow: scroll;
  flex: 1;
  margin-top: 8px;
`;

const ACTION_CONTAINER = css`
  justify-content: center;
  align-items: center;
  flex: 1;
  max-height: 60px;
  display: flex;
`;

interface ITimezonePickerProps {
  open: boolean;
  disabled: string[];
  onClose(): void;
  onSelect(timezone: string): void;
}

interface ITimezonePickerState {
  search: string;
  filteredTimezones: string[];
}

function getTimezones() {
  const offsets = {};
  const _timezones = moment.tz
    .names()
    .filter((name) => /\//.test(name) && !/Etc\//.test(name));
  for (const timezone of _timezones) {
    offsets[timezone] = moment.tz(timezone).utcOffset();
  }
  return _timezones.sort((a, b) => {
    return offsets[b] - offsets[a];
  });
}

const timezones = getTimezones();
const fuzzy = new Fuse(timezones, {
  threshold: 0.9,
});

export class TimezonePicker extends React.Component<
  ITimezonePickerProps,
  ITimezonePickerState
> {
  public state = {
    search: "",
    filteredTimezones: [],
  };

  private get filteredTimezones() {
    if (this.state.search) {
      return fuzzy.search(this.state.search).map(({ item }) => item);
    }
    return timezones;
  }

  private onSelect = (key) => {
    this.setState({ search: "" });
    this.props.onSelect(key);
  };

  public componentDidUpdate(prev) {
    if (prev.open == false && this.props.open) {
      const el = document.querySelector(
        `[data-timezone="${moment.tz.guess()}"]`
      );
      if (el) {
        el.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }
    }
    if (this.state.search) {
      const node = ReactDOM.findDOMNode(this) as HTMLDivElement;
      node.querySelector(".bp3-menu").scrollTop = 0;
    }
  }

  public render() {
    const { open, onClose } = this.props;
    return (
      <Popup open={open}>
        <InputGroup
          leftIcon="search"
          placeholder="Choose a timezone"
          onChange={(e) => this.setState({ search: e.target.value })}
          autoFocus
        />
        <Menu css={TIMEZONE_PICKER}>
          {this.filteredTimezones.map((name) => (
            <MenuItem
              disabled={!!~this.props.disabled.indexOf(name)}
              key={name}
              text={name.replace(/_/g, " ")}
              data-timezone={name}
              label={moment.tz(name).format("Z")}
              onClick={() => this.onSelect(name)}
            />
          ))}
        </Menu>
        <div css={ACTION_CONTAINER}>
          <Button minimal>
            <Icon iconSize={18} icon="small-cross" onClick={() => onClose()} />
          </Button>
        </div>
      </Popup>
    );
  }
}
