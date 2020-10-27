import React, { FunctionComponent, useEffect, useState } from "react";

interface IProgressProps {
  progress: number;
}

export const Progress: FunctionComponent<IProgressProps> = (props) => {
  const circumference = 2 * Math.PI * 54;

  const [radius, setRadius] = useState(0);

  useEffect(() => {
    setRadius(circumference * (1 - props.progress / 100));
  });

  return (
    <div className={"progress-container"}>
      <svg className="progress" viewBox={"0 0 120 120"}>
        <circle r={54} cx={60} cy={60} />
        {props.progress > -1 && (
          <circle
            className="fill"
            r={54}
            cx={60}
            cy={60}
            strokeDashoffset={radius}
            strokeDasharray={circumference}
          />
        )}
      </svg>
      <div className="progress-content">{props.children}</div>
    </div>
  );
};
