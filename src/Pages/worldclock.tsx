import { Button, Icon, Menu, MenuItem } from "@blueprintjs/core";
import { TimezonePicker } from "@blueprintjs/timezone";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ClockFace } from "../Components/ClockFace";
import { Popup } from "../Components/Popup";
import moment from "moment";
import "moment-timezone";
import { Storage } from "../Lib/storage";
import { css } from "emotion";
import {
  Transition,
  CSSTransition,
  TransitionGroup,
} from "react-transition-group";

const addTimezoneContainer = css`
  height: 120px;
  width: 80px;
  display: flex;
  justify-content: center;
  flex: 1;
`;
const addTimezoneIcon = css`
  height: 62px;
  width: 62px;
  border-radius: 50%;
  border: solid 2px #5c7080;
  color: #5c7080;
  display: flex;
  margin-top: 9;
  justify-content: center;
  align-items: center;
  transition: all ease 100ms;
  :hover {
    border-color: white;
    color: white;
  }
`;

const AddTimezone: React.FunctionComponent<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <div className={addTimezoneContainer}>
      <div className={addTimezoneIcon} onClick={onClick}>
        <Icon icon="plus" />
      </div>
    </div>
  );
};

export function WorldClock() {
  const [zones, setZones] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => {
    Storage.load();
    setZones(Storage.get("timezones") || []);
  }, []);
  useLayoutEffect(() => {
    const el = document.querySelector(`[data-timezone="${moment.tz.guess()}"]`);
    if (el) {
      el.scrollIntoView({
        block: "center",
        behavior: "auto",
      });
    }
  }, [pickerOpen]);
  const onClick = (name) => {
    const _zones = [...(Storage.get("timezones") || []), name];
    setZones(_zones);
    setPickerOpen(false);
    Storage.set("timezones", _zones);
    Storage.save();
  };
  const onRemove = useCallback((zone) => {
    const _zones = [...zones];
    _zones.splice(_zones.indexOf(zone), 1);
    setZones(_zones);
  }, [zones]);
  return (
    <div>
      <TransitionGroup
        style={{
          padding: "40px 10px",
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {zones.map((zone) => (
          <CSSTransition timeout={500} classNames="clock" key={zone}>
            <ClockFace timezone={zone} key={zone} onRemove={onRemove}/>
          </CSSTransition>
        ))}
        <AddTimezone onClick={() => setPickerOpen(true)} />
      </TransitionGroup>
      <Popup style={{ textAlign: "center" }} open={pickerOpen}>
        <Menu style={{ height: "80%", overflow: "scroll", flex: 1 }}>
          {moment.tz
            .names()
            .filter((name) => /\//.test(name) && !/Etc\//.test(name))
            .sort((a, b) => {
              return moment.tz(b).utcOffset() - moment.tz(a).utcOffset();
            })
            .map((name) => (
              <MenuItem
                key={name}
                text={name}
                data-timezone={name}
                label={moment.tz(name).format("Z")}
                onClick={() => onClick(name)}
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
            <Icon
              iconSize={18}
              icon="small-cross"
              onClick={() => setPickerOpen(false)}
            />
          </Button>
        </div>
      </Popup>
    </div>
  );
}
