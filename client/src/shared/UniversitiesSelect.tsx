import React, { useEffect } from 'react';

import { School } from '../models/User';
import { Container } from '../profile/components/Container';
import { Input } from '../profile/components/Input';
import { Text } from '../profile/components/Text';
import api from '../utils/api';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  value: string;
  onChange: (name: string, value: string | School) => void;
}

const UniversitiesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [universities, setUniversities] = React.useState<School[]>([]);
  const { value, onChange, } = props;

  useEffect(() => {
    if (value !== '' && focused) {
      api.get(`/university/${value}`).then((res) => {
        setUniversities(res.data);
      });
    } else {
      setTimeout(() => {
        setUniversities([]);
      }, 200);
    }
  }, [value, focused]);
  
  return (
    <Container position="relative">
      <Input
        type="text"
        value={value}
        placeholder="School"
        name="school-name"
        onChange={(e) => onChange('school-name', e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={universities.length > 0}>
        {universities.map((university, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              onChange('school-name', university);
              setUniversities([]);
            }}
          >
            <Text fontSize={14} fontWeight={'bold'}>
              {university.name}
            </Text>
            <Text fontSize={13}>{university.country}</Text>
          </Suggestion>
        ))}
      </Suggestions>
    </Container>
  );
};

export default UniversitiesSelect;
