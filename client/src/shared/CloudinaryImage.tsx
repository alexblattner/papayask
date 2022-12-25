import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import React, { useEffect } from 'react';

import { cld } from '../utils/CloudinaryConfig';

interface Props {
  publicId: string;
  size?: number;
  radius?: number;
}

const CloudinaryPicture = (props: Props) => {
  const [image, setImage] = React.useState<CloudinaryImage | null>(null);

  useEffect(() => {
    const img = cld.image(`${process.env.REACT_APP_ENV!}/${props.publicId}`);
    img
      .resize(scale(props.size || 100, props.size || 100))
      .roundCorners(byRadius(props.radius || 0));
    setImage(img);
  }, []);

  if (!image) return null;

  return <AdvancedImage cldImg={image} ></AdvancedImage>;
};

export default CloudinaryPicture;
