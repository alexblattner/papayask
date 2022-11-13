import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Container } from '../profile/components/Container';
import { Input } from '../profile/components/Input';
import { Text } from '../profile/components/Text';
import countries, { Country } from '../data/countries';

const Suggestions = styled('div')<{ show: boolean }>`
  position: absolute;
  top: 35px;
  left: 0;
  max-height: 240px;
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  background-color: #fff;
  width: 300px;
  z-index: 999;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: scroll;
`;

const Suggestion = styled('div')`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary20};
  }
`;

interface Props {
  value: string;
  onChange: (name: string, value: string) => void;
  inputName: string;
}

const CountriesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<Country[]>([]);
  const { value, onChange, inputName } = props;

  useEffect(() => {
    if (value.length > 0 && focused) {
      const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredCountries);
    } else {
      setTimeout(() => {
        setSuggestions([]);
      }, 200);
    }
  }, [value, focused]);

  return (
    <Container position="relative">
      <Input
        type="text"
        value={value}
        placeholder="Country"
        name={inputName}
        onChange={(e) => onChange(inputName, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              console.log(suggestion);

              onChange(inputName, suggestion.name);
            }}
          >
            <Text fontSize={14} fontWeight={'bold'}>
              {suggestion.name}
            </Text>
          </Suggestion>
        ))}
      </Suggestions>
    </Container>
  );
};

export default CountriesSelect;
