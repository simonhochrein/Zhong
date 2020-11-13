import { Button, Icon, InputGroup, Menu, MenuItem } from "@blueprintjs/core";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ClockFace } from "../Components/ClockFace";
import "moment-timezone";
import { Storage } from "../Lib/storage";
import { css } from "emotion";
import {
  Transition,
  CSSTransition,
  TransitionGroup,
} from "react-transition-group";
import { TimezonePicker } from "../Components/TimezonePicker";

import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { SortableZone as SortableTimezone } from "../Components/SortableTimezone";

const addTimezoneContainer = css`
  height: 120px;
  width: 80px;
  display: flex;
  justify-content: center;
  flex-shrink: 1;
  margin-top: 12;
  /* align-items: center; */
`;
const addTimezoneIcon = css`
  height: 62px;
  width: 62px;
  border-radius: 50%;
  border: solid 2px #5c7080;
  color: #5c7080;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease 200ms;
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
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    Storage.load();
    setZones(Storage.get("timezones") || []);
  }, []);
  const onClick = (name) => {
    const _zones = [...(Storage.get("timezones") || []), name];
    setZones(_zones);
    setPickerOpen(false);
    Storage.set("timezones", _zones);
    Storage.save();
  };
  const onRemove = useCallback(
    (zone) => {
      const _zones = [...zones];
      _zones.splice(_zones.indexOf(zone), 1);
      setZones(_zones);
      Storage.set("timezones", _zones);
      Storage.save();
    },
    [zones]
  );
  const onEdit = useCallback(() => {
    setEditMode(true);
  }, []);
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = zones[dragIndex];
      const _zones = [...zones];
      _zones.splice(_zones.indexOf(dragCard), 1);
      _zones.splice(hoverIndex, 0, dragCard);
      setZones(_zones);
    },
    [zones]
  );

  if (editMode) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ padding: "40px 0" }}>
          <DndProvider backend={HTML5Backend}>
            {zones.map((zone, index) => (
              <SortableTimezone
                name={zone}
                key={zone}
                index={index}
                moveCard={moveCard}
              />
            ))}
          </DndProvider>
        </div>
        <Button onClick={() => setEditMode(false)}>Save</Button>
      </div>
    );
  }
  return (
    <div>
      <TransitionGroup
        style={{
          padding: "40px 10px",
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {zones.map((zone) => (
          <CSSTransition timeout={500} classNames="clock" key={zone}>
            <ClockFace
              timezone={zone}
              key={zone}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          </CSSTransition>
        ))}
        <AddTimezone onClick={() => setPickerOpen(true)} />
      </TransitionGroup>
      <TimezonePicker
        disabled={zones}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onClick}
      />
    </div>
  );
}
