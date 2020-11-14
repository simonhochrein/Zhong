/** @jsx jsx */
import { Icon } from "@blueprintjs/core";
import { jsx, css } from "@emotion/react";
import React, { useRef } from "react";
import { useDrop, useDrag } from "react-dnd";

const DRAG_ICON = css`
  flex-shrink: 1;
`;
const NAME = css`
  flex: 1;
  text-align: center;
`;
const SPACER = css`
  flex-shrink: 1;
  width: 16px;
`;
const ROW = css`
  display: flex;
`;
const ROW_CONTAINER = css`
  padding: 8px;
  text-align: center;
`;

export function SortableZone({ name, index, moveCard }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "timezone",
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "timezone", name, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }} css={ROW_CONTAINER}>
      <div css={ROW}>
        <Icon icon="drag-handle-vertical" css={DRAG_ICON} />
        <span css={NAME}>{name}</span>
        <span css={SPACER} />
      </div>
    </div>
  );
}
