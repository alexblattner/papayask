import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { cld } from '../utils/CloudinaryConfig';

const StyledImage = styled.div<Props>`
  width: ${(props) => props.size || 100}px;
  height: ${(props) => props.size || 100}px;

  img {
    object-fit: cover;
    height: 100%;
  }
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: number;
  radius?: number;
}

const Image = (props: Props) => {
  const [image, setImage] = React.useState<CloudinaryImage | string | null>(
    null
  );

  useEffect(() => {
    if (!props.src) {
      setImage(null);
    } else if (props.src?.includes('facebook')) {
      setImage(props.src);
    } else {
      const img = cld.image(`${process.env.REACT_APP_ENV!}/${props.src}`);
      img
        .resize(scale(props.size || 100, props.size || 100))
        .roundCorners(byRadius(props.radius || 0));
      setImage(img);
    }
  }, [props.src]);

  return !image ? (
    <StyledImage size={props.size}>
      <img
        src={`https://source.unsplash.com/random/${props.size}x${props.size}`}
        alt="profile-img"
      />
    </StyledImage>
  ) : typeof image === 'string' ? (
    <StyledImage size={props.size}>
      <img src={image} alt={props.alt} />
    </StyledImage>
  ) : (
    <AdvancedImage cldImg={image} />
  );
};

export default Image;
