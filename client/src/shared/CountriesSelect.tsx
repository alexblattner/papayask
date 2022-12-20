import React, { useEffect } from 'react';

import { Container } from './Container';
import { Input } from './Input';
import { Text } from './Text';
import countries from '../data/countries';
import { Suggestions, Suggestion } from './Suggestions';
import { placeholder } from '@cloudinary/html';

interface Props {
  value: string;
  onChange: (country: string) => void;
  inputName: string;
  width?: string;
  placeholder?: string;
  options?: string[];
  adder?: (value: string) => void;
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

        const startsWithSuggestions = finalSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().startsWith(value.toLowerCase())
        );
        startsWithSuggestions.forEach((suggestion) => {
          finalSuggestions = finalSuggestions.filter(
            (suggestion2) => suggestion2 !== suggestion
          );
          finalSuggestions.unshift(suggestion);
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
        placeholder={props.placeholder?props.placeholder:"Country"}
        name={inputName}
        width={props.width || '100%'}
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
              if (props.adder) props.adder(suggestion);
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
