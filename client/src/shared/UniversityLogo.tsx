import { Container } from './Container';
import SvgIcon from './SvgIcon';

interface Props {
  logo?: string;
}

const UniversityLogo = (props: Props) => {
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
      {!props.logo ? (
        <SvgIcon src="study" size={50} />
      ) : (
        <img
          src={props.logo}
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
        />
      )}
    </Container>
  );
};

export default UniversityLogo;
