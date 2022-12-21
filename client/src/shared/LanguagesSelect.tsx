import React, { useEffect } from 'react';

import { Container } from './Container';
import { Input } from './Input';
import { Text } from './Text';
import languages from '../data/languages';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  addLanguage: (language: string) => void;
  allLanguages?: string[];
  onBlur?: (value: string) => void;
  width?: string;
}

const LanguagesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const { addLanguage } = props;

  const pickLanguage = (language: string) => {
    addLanguage(language);
    if (!props.allLanguages) setValue('');
    else setValue(language);
    setSuggestions([]);
  };

  useEffect(() => {
    if (value.length > 0 && focused) {
      if (props.allLanguages) {
        setSuggestions(props.allLanguages);
      } else {
        const filteredlanguages = languages.filter((language) =>
          language.name.toLowerCase().includes(value.toLowerCase())
        );
        let finalSuggestions: string[] = [];
        filteredlanguages.forEach((language) => {
          finalSuggestions.push(language.name);
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
        placeholder="Languages"
        name=""
        width={props.width}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (props.onBlur) props.onBlur(value);
        }}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              pickLanguage(suggestion);
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

export default LanguagesSelect;
