import React from 'react';

import { Input } from './components/Input';
import { Text } from './components/Text';
import { TextArea } from './components/TextArea';

interface Props {
  title: string;
  bio: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setBio: React.Dispatch<React.SetStateAction<string>>;
}

const StepOne = (props: Props) => {
  const { title, bio, setTitle, setBio } = props;
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
    </>
  );
};

export default StepOne;
