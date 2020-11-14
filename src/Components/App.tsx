import { Classes, Colors } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import { Timer } from "../Pages/timer";
import { nativeTheme } from "@electron/remote";
import { WorldClock } from "../Pages/worldclock";
import { css, cx } from "emotion";
import { Footer } from "./Footer";
import { TabContext } from "../Lib/TabContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Timer as TimerClass } from "../Lib/timer";
import { StopWatch } from "../Pages/stopwatch";

export function App() {
  const [theme, setTheme] = useState(nativeTheme.shouldUseDarkColors);
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const themeUpdateCallback = () => {
      setTheme(nativeTheme.shouldUseDarkColors);
    };
    const doneCallback = () => {
      setTab(2);
    };
    nativeTheme.on("updated", themeUpdateCallback);
    TimerClass.instance.on("done", doneCallback);
    return () => {
      nativeTheme.off("updated", themeUpdateCallback);
      TimerClass.instance.off("done", doneCallback);
    };
  }, []);
  const ROOT = css`
    display: flex;
    flex-direction: column;
    background: ${theme ? Colors.DARK_GRAY3 : Colors.WHITE};
    .popup {
      background: ${theme ? Colors.DARK_GRAY3 : Colors.WHITE};
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
      <div className={cx(theme ? Classes.DARK : "", ROOT)}>
        <TransitionGroup className={CONTENT}>
          <CSSTransition classNames="page" timeout={200} key={tab}>
            <div className={PAGE}>{getComponent(tab)}</div>
          </CSSTransition>
        </TransitionGroup>
        <div className={FOOTER}>
          <Footer />
        </div>
      </div>
    </TabContext.Provider>
  );
}
