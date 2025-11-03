import { FC, useEffect, useState } from "react";
import "./Spinner.css";

// eslint-disable-next-line react/prop-types
const SpinnerWithCard: FC<{ startTime: number }> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      setElapsedTime(elapsed);
    }, 100);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className='spinner-container'>
      <div className='spinner'></div>
      <p className='mt-2'>{elapsedTime.toFixed(1)}s</p>
    </div>
  );
};

export default SpinnerWithCard;
