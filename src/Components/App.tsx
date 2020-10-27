import { Classes, Colors } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Timer } from "../Pages/timer";
import { nativeTheme } from "@electron/remote";
import { WorldClock } from "../Pages/worldclock";
import { css, cx } from "emotion";

export function App() {
  const [theme, setTheme] = useState(nativeTheme.shouldUseDarkColors);
  useEffect(() => {
    nativeTheme.on("updated", () => {
      setTheme(nativeTheme.shouldUseDarkColors);
    });
  });
  const ROOT = css`
    background: ${theme ? Colors.DARK_GRAY3 : Colors.WHITE };
    .popup {
      background: ${theme ? Colors.DARK_GRAY3 : Colors.WHITE };
    }
  `;
  return (
    <div className={cx(theme ? Classes.DARK : "", ROOT)}>
      <WorldClock />
      {/* <Timer/> */}
    </div>
  );
}
