import { Colors, Icon, Popover, Position, Tooltip } from "@blueprintjs/core";
import { css, cx } from "emotion";
import React, { useContext, useState } from "react";
import { TabContext } from "../Lib/TabContext";

const FOOTER_CONTAINER = css`
  display: flex;
  flex-direction: row;
  transition: opacity 200ms ease-in-out;
  :hover {
    .footer-item {
      color: ${Colors.GRAY3};
      :hover {
        color: ${Colors.WHITE};
      }
    }
  }
`;
const FOOTER_ITEM = css`
  flex: 1;
  padding: 16px 0;
  text-align: center;
  color: ${Colors.GRAY1};
  transition: color 200ms ease-in-out;
`;
export function Footer() {
  const [tab, setTab] = useContext(TabContext);
  return (
    <div className={FOOTER_CONTAINER}>
      <div
        className={cx("footer-item", FOOTER_ITEM)}
        onClick={() => setTab(0)}
      >
        <Icon icon="globe" />
      </div>
      <div
        className={cx("footer-item", FOOTER_ITEM)}
        onClick={() => setTab(1)}
      >
        <Icon icon="notifications" />
      </div>
      <div
        className={cx("footer-item", FOOTER_ITEM)}
        onClick={() => setTab(2)}
      >
        <Icon icon="time" />
      </div>
    </div>
  );
}
