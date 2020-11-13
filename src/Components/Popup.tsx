import React from "react";
import { css, cx } from "emotion";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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
  padding: 8px;
`;

export const Popup: React.FunctionComponent<{ style?; open: boolean }> = ({
  children,
  style,
  open,
}) => {
  return (
    <TransitionGroup>
      {open && (
        <CSSTransition classNames="popup" timeout={200} key='popup'>
          <div className={cx("popup", POPUP)}>
            <div className={POPUP_CONTENT}>{children}</div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
