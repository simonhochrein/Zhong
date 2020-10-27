import React from "react";
import { css, cx } from "emotion";

const POPUP = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  flex-direction: column;
  justify-content: center;
`;

const POPUP_CONTENT = css`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Popup: React.FunctionComponent<{style?, open: boolean}> = ({ children, style, open }) => {
  return (
    <div className={cx("popup", POPUP)} style={{display: open ? 'flex' : 'none'}}>
      <div className={POPUP_CONTENT}>{children}</div>
    </div>
  );
}
