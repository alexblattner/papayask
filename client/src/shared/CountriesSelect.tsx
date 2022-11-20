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
  size?: 'small' | 'large';
  options?: string[];
  adder?: (value:string) => void;
}

const CountriesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const { value, onChange, inputName } = props;

  useEffect(() => {
    if (value.length > 0 && focused) {
      if (props.options) {
        setSuggestions(props.options);
      } else {
        const filteredCountries = countries.filter((country) =>
          country.name.toLowerCase().includes(value.toLowerCase())
        );
        let finalSuggestions: string[] = [];
        filteredCountries.forEach((country) => {
          finalSuggestions.push(country.name);
        });
        setSuggestions(finalSuggestions);
      }
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
        width={props.size === 'small' ? '188px' : ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              onChange(suggestion);
              if(props.adder)
                props.adder(suggestion);
            }}
          >
            <Text fontSize={14} fontWeight={'bold'}>
              {suggestion}
            </Text>
          </Suggestion>
        ))}
      </Suggestions>
    </Container>
  );
};

export default CountriesSelect;
