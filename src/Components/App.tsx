import { Classes } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Timer } from "../Pages/timer";
import {nativeTheme} from '@electron/remote';

export function App() {
    const [theme, setTheme] = useState(nativeTheme.shouldUseDarkColors);
    useEffect(() => {
        nativeTheme.on('updated', () => {
            setTheme(nativeTheme.shouldUseDarkColors);
        });
    });
  return (
    <div className={theme ? Classes.DARK : ""}>
      <Timer/>
    </div>
  );
}
