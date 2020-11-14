/** @jsx jsx */
import { Button, Colors } from "@blueprintjs/core";
import { jsx, css, keyframes, Global } from "@emotion/react";
import React from "react";

const deg2rad = (deg) => (deg * Math.PI) / 180;

const animation = keyframes`
0% {
    stroke-width: 0;
    opacity: 0;
}
50% {
    stroke-width: 10px;
    opacity: 1;
}
100% {
    stroke-width: 0;
    opacity: 0;
}
`;
const colors = keyframes`
0%{
    stroke: ${Colors.BLUE1};
}
20%{
    stroke: ${Colors.GREEN1};
}
40%{
    stroke: ${Colors.GOLD1};
}
60%{
    stroke: ${Colors.ORANGE1};
}
80%{
    stroke: ${Colors.RED1};
}
100%{
    stroke: ${Colors.BLUE1};
}
`;
const fadeIn = keyframes`
from{
    opacity: 0;
}
to{
    opacity: 0.95;
}
`;

const CONTAINER = css`
  height: 100%;
  position: relative;
  animation: ${fadeIn} 1s forwards;
  background-color: ${Colors.DARK_GRAY3};
  text-align: center;
`;

const DONE = css`
  position: absolute;
  top: 178px;
  left: 50%auto;
  transform: translateX(-50%);
`;

const ANIMATION = css`
  position: absolute;
  left: 0;
  top: 0;
`;

export function Done() {
  const points = [];
  const count = 20;
  const increment = 360 / count;
  for (let i = 0; i < count; i++) {
    const angle = deg2rad(i * increment);
    points.push({
      x: Math.cos(angle - 90) * 100 + 150,
      y: Math.sin(angle - 90) * 100 + 150,
    });
  }
  return (
    <div css={CONTAINER}>
      <Global
        styles={css`
          html,
          body,
          #root {
            height: 100%;
          }
        `}
      />
      <svg width={300} height={300} viewBox={"0 0 300 300"} css={ANIMATION}>
        {points.map(({ x, y }, k) => (
          <circle
            key={k}
            r={2}
            fill="none"
            cx={x}
            cy={y}
            css={css`
              stroke-width: 0;
              transform-origin: center center;
              animation: ${animation} 2s infinite, ${colors} 20s infinite;
              animation-delay: ${k * 100}ms, 0s;
            `}
          />
        ))}
        <text x={150} y={150} textAnchor={"middle"} fontSize={22} fill="white">
          Timer Ended
        </text>
      </svg>
      <Button
        css={DONE}
        intent="success"
        outlined
        onClick={() => window.close()}
      >
        Done
      </Button>
    </div>
  );
}
