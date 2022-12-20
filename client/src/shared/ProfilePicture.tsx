import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { cld } from '../utils/CloudinaryConfig';

const StyledImage = styled.div<Props>`
  width: ${(props) => props.size || 100}px;
  min-width: ${(props) => props.size || 100}px;
  max-width: ${(props) => props.size || 100}px;
  height: ${(props) => props.size || 100}px;
  min-height: ${(props) => props.size || 100}px;
  max-height: ${(props) => props.size || 100}px;
  border-radius: ${(props) => props.radius || 0}%;
  overflow: hidden;

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

const ProfilePicture = (props: Props) => {
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
        .resize(fill(props.size || 100, props.size || 100).gravity('faces'))
        .roundCorners(byRadius(props.radius || 0));
      setImage(img);
    }
  }, [props.src]);

  return !image || image === '' ? (
    <StyledImage radius={props.radius} size={props.size}>
      <img src={`assets/default.png`} alt="profile-img" />
    </StyledImage>
  ) : typeof image === 'string' ? (
    <StyledImage radius={props.radius} size={props.size}>
      <img src={image} alt={props.alt} />
    </StyledImage>
  ) : (
    <StyledImage radius={props.radius} size={props.size}>
      <AdvancedImage cldImg={image} />
    </StyledImage>
  );
};

export default ProfilePicture;
