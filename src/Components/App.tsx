/** @jsx jsx */
import { Classes, Colors } from "@blueprintjs/core";
import { useState } from "react";
import { Timer } from "../Pages/timer";
import { WorldClock } from "../Pages/worldclock";
import { Footer } from "./Footer";
import { TabContext } from "../Lib/TabContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StopWatch } from "../Pages/stopwatch";
import { jsx, css, Global } from "@emotion/react";

const ROOT = css`
  display: flex;
  flex-direction: column;
  background: ${Colors.DARK_GRAY3};
  .popup {
    background: ${Colors.DARK_GRAY3};
  }
`;
const CONTENT = css`
  flex-grow: 1;
  position: relative;
`;
const PAGE = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;
const FOOTER = css`
  flex-shrink: 1;
`;

export function App() {
  const [tab, setTab] = useState(0);

  const getComponent = (tab) => {
    switch (tab) {
      case 0:
        return <WorldClock />;
      case 1:
        return <StopWatch />;
      case 2:
        return <Timer />;
    }
  };
  return (
    <TabContext.Provider value={[tab, setTab]}>
      <Global
        styles={css`
          body {
            margin: 0;
            opacity: 0.95;
          }
          * {
            outline: none !important;
          }
          #root > div {
            height: 100%;
          }
          .bp3-dark {
            background: #293742;
          }
          .page-enter {
            opacity: 0;
          }
          .page-enter-active {
            opacity: 1;
            transition: opacity 200ms;
          }
          .page-exit {
            opacity: 1;
          }
          .page-exit-active {
            opacity: 0;
            transition: opacity 200ms;
          }
        `}
      />
      <div className={Classes.DARK} css={ROOT}>
        <TransitionGroup css={CONTENT}>
          <CSSTransition classNames="page" timeout={200} key={tab}>
            <div css={PAGE}>{getComponent(tab)}</div>
          </CSSTransition>
        </TransitionGroup>
        <div css={FOOTER}>
          <Footer />
        </div>
      </div>
    </TabContext.Provider>
  );
}
