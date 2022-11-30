import Icons from '../data/sprite.svg';

interface IconProps {
  src: string;
  width?: number;
  height?: number;
  color?: string;
}

const Icon = ({ src, width, height, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : '24'}
      height={height ? height : '24'}
      fill={color ? color : 'currentColor'}
    >
      <use href={`${Icons}#${src}`} fill={color ? color : 'currentColor'} />
    </svg>
  );
};

export default Icon;


