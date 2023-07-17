import React from 'react';

interface LoadingPulseProps {
  width?: number;
  height?: number;
}

function LoadingPulse(props: LoadingPulseProps) {
  const { width = 32, height = 32 } = props;

  return (
    <div
      style={{
        width,
        height,
      }}
      className="ms-2 d-flex align-items-center animate-pulse bg-light rounded-circle"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

LoadingPulse.defaultProps = {
  width: 32,
  height: 32,
};

export default LoadingPulse;
