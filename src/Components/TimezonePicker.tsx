import { InputGroup, Menu, MenuItem, Button, Icon } from "@blueprintjs/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Popup } from "./Popup";
import Fuse from "fuse.js";
import ReactDOM from "react-dom";

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
  const timezones = moment.tz
    .names()
    .filter((name) => /\//.test(name) && !/Etc\//.test(name));
  for (const timezone of timezones) {
    offsets[timezone] = moment.tz(timezone).utcOffset();
  }
  return timezones.sort((a, b) => {
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
      console.log(el);
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
      <Popup style={{ textAlign: "center" }} open={open}>
        <InputGroup
          leftIcon="search"
          placeholder="Choose a timezone"
          onChange={(e) => this.setState({ search: e.target.value })}
        />
        <Menu
          style={{ height: "80%", overflow: "scroll", flex: 1, marginTop: 8 }}
        >
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
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            maxHeight: 60,
            display: "flex",
          }}
        >
          <Button minimal>
            <Icon iconSize={18} icon="small-cross" onClick={() => onClose()} />
          </Button>
        </div>
      </Popup>
    );
  }
}
