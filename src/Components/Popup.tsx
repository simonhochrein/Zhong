/** @jsx jsx */
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { jsx, css, Global } from "@emotion/react";

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
    <TransitionGroup css={css`text-align: center;`}>
      <Global
        styles={css`
          .popup-enter {
            opacity: 0;
          }
          .popup-enter-active {
            opacity: 1;
            transition: opacity 200ms;
          }
          .popup-exit {
            opacity: 1;
          }
          .popup-exit-active {
            opacity: 0;
            transition: opacity 200ms;
          }
        `}
      />
      {open && (
        <CSSTransition classNames="popup" timeout={200} key="popup">
          <div css={POPUP}>
            <div css={POPUP_CONTENT}>{children}</div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
