import React, { useEffect } from 'react';

import { Container } from '../profile/components/Container';
import { Input } from '../profile/components/Input';
import { Text } from '../profile/components/Text';
import countries, { Country } from '../data/countries';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  value: string;
  onChange: (country: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              console.log(suggestion);

              onChange(suggestion.name);
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
