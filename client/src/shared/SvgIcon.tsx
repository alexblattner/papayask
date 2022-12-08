import Icons from '../data/sprite.svg';

interface IconProps {
  src: string;
  size?: number;
  color?: string;
}

const Icon = ({ src, size, color }: IconProps) => {
  const finalColor = () => {
    let res = 'currentColor';
    if (color) {
      color === 'primary' ? (res = '#DC693F') : (res = color);
    }
    return res;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : '24'}
      height={size ? size : '24'}
      fill={finalColor()}
    >
      <use href={`${Icons}#${src}`} fill={color ? color : 'currentColor'} />
    </svg>
  );
};

export default Icon;
