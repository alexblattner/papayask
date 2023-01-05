import Icons from "../data/sprite.svg";

interface IconProps {
  src: string;
  size?: number;
  color?: string;
}

const Icon = ({ src, size, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : "24"}
      height={size ? size : "24"}
      fill={color ? color : "currentColor"}
    >
      <use href={`${Icons}#${src}`} fill={color ? color : "currentColor"} />
    </svg>
  );
};

export default Icon;
