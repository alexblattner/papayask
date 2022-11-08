import React from 'react';

interface IconProps {
  src: string;
  width?: number;
  height?: number;
}

const Icon = ({ src, width, height }: IconProps) => {
  return (
    <img
      src={`/icons/${src}.svg`}
      width={width ? width : 24}
      height={height ? height : 24}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default Icon;
