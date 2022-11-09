import React from 'react';
import Icon from '../shared/Icon';
import { socialName } from '../utils/socialName';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import { TextArea } from './components/TextArea';

interface Props {
  title: string;
  bio: string;
  inputSocial: string;
  social: string[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  setInputSocial: React.Dispatch<React.SetStateAction<string>>;
  setSocial: React.Dispatch<React.SetStateAction<string[]>>;
  removeSocial: (index: number) => void;
}

const StepOne = (props: Props) => {
  const {
    title,
    bio,
    inputSocial,
    setTitle,
    setBio,
    setInputSocial,
    setSocial,
    removeSocial,
    social,
  } = props;
  return (
    <>
      <Text fontSize={32} fontWeight={600} mb={16}>
        Headline
      </Text>
      <Input
        type="text"
        value={title}
        placeholder="Enter a link and press enter"
        onChange={(e) => setTitle(e.target.value)}
        name="headline"
      />
      <Text fontSize={32} fontWeight={600} mb={16}>
        Tell your clients about yourself
      </Text>
      <TextArea value={bio} onChange={(e) => setBio(e.target.value)} />
      <Text fontSize={32} fontWeight={600} mb={16}>
        Add your social links
      </Text>
      <Input
        type="text"
        name="social"
        value={inputSocial}
        placeholder="Enter a link and press enter"
        onChange={(e) => setInputSocial(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setSocial([...social, inputSocial]);
            setInputSocial('');
          }
        }}
      />
      <Container flex gap={16} flexWrap>
        {social.map((social, i) => (
          <Container position="relative" key={social}>
            <Icon src={socialName(social)} width={32} height={32} />
            <Container
              position="absolute"
              top={-10}
              right={-10}
              onClick={() => removeSocial(i)}
            >
              <Icon src="close" width={12} height={12} />
            </Container>
          </Container>
        ))}
      </Container>
    </>
  );
};

export default StepOne;
