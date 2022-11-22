import React, { useEffect } from 'react';

import { University } from '../models/User';
import { Container } from './Container';
import { Input } from './Input';
import { Text } from './Text';
import api from '../utils/api';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  value: string;
  onChange: (name: string, value: string | University) => void;
}

const UniversitiesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [universities, setUniversities] = React.useState<University[]>([]);
  const { value, onChange } = props;

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
        placeholder="University"
        name="university-name"
        onChange={(e) => onChange('university-name', e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={universities.length > 0}>
        {universities.map((university, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              onChange('university-name', university);
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
