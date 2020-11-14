/** @jsx jsx */
import React, { FunctionComponent, useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { Colors } from "@blueprintjs/core";

interface IProgressProps {
  progress: number;
  active?: boolean;
}

const PROGRESS_CONTAINER = css`
  flex: 1;
  min-height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const PROGRESS = css`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transform: rotate(-90deg);
`;

const PROGRESS_CONTENT = css`
  text-align: center;
  z-index: 1;
`;

export const Progress: FunctionComponent<IProgressProps> = (props) => {
  const circumference = 2 * Math.PI * 54;

  const [radius, setRadius] = useState(0);

  useEffect(() => {
    setRadius(circumference * props.progress);
  });

  return (
    <div css={PROGRESS_CONTAINER}>
      <svg css={PROGRESS} viewBox={"0 0 120 120"}>
        <circle
          r={54}
          cx={60}
          cy={60}
          stroke="rgba(16, 22, 26, 0.16)"
          fill="none"
          strokeWidth={4}
        />
        {props.progress > -1 && (
          <circle
            css={css`
              transition: stroke-dashoffset 1000ms linear, stroke 200ms;
            `}
            strokeLinecap="round"
            fill="none"
            strokeWidth={4}
            stroke={props.active ? Colors.GREEN3 : Colors.DARK_GRAY5}
            r={54}
            cx={60}
            cy={60}
            strokeDashoffset={radius}
            strokeDasharray={circumference}
          />
        )}
      </svg>
      <div css={PROGRESS_CONTENT}>{props.children}</div>
    </div>
  );
};
