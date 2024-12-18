"use client";

import React, { useEffect, useState } from "react";
const Countdown = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval);
          return 0; // Dừng lại khi đếm đến 0
        }
        return prevSeconds - 1;
      });
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="countdown">
      <span>{hours}</span>h : <span>{minutes}</span>m :{" "}
      <span>{remainingSeconds}</span>s
    </div>
  );
};

export default Countdown;
