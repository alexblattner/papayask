import React, { useEffect } from 'react';

import { Container } from '../profile/components/Container';
import { Input } from '../profile/components/Input';
import { Text } from '../profile/components/Text';
import countries, { Country } from '../data/countries';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  inputName: string;
  options: string[];
  placeholder: string;
  adder: (value:string) => void;
}

const OptionsInput = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [value, setValue] = React.useState<string>('');
  const { inputName,options,placeholder } = props;

  useEffect(() => {
    if (value.length > 0 && focused) {
      
        let finalSuggestions: string[] = [];
        props.options.forEach((option) => {
          if(option.toLowerCase().includes(value.toLowerCase()))
          finalSuggestions.push(option);
        });
        setSuggestions(finalSuggestions);
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
        placeholder={placeholder}
        name={inputName}
        onChange={(e) => {
          setValue(e.target.value)
          if(e.target.value.length === 0) {
            props.adder('')
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
                props.adder(suggestion);
                setValue(suggestion)
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

export default OptionsInput;
