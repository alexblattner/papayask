import React from 'react';
import CloudinaryPicture from './CloudinaryImage';
import { Container } from './Container';
import SvgIcon from './SvgIcon';

interface Props {
  logo?: string;
}

const CompanyLogo = ({logo}: Props) => {
  return (
    <Container
      border="2px solid var(--secondary-l1)"
      borderRadius="8px"
      background="white"
      width="88px"
      height="88px"
      flex
      align="center"
      justify="center"
    >
      {!logo ? (
        <SvgIcon src="work" size={50} />
      ) : (
        <CloudinaryPicture publicId={logo} size={50} />
      )}
    </Container>
  );
};

export default CompanyLogo;