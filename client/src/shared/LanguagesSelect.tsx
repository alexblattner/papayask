import React, { useEffect } from 'react';

import { Container } from '../profile/components/Container';
import { Input } from '../profile/components/Input';
import { Text } from '../profile/components/Text';
import languages, { Language } from '../data/languages';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  addLanguage: (language: string) => void;
}

const LanguagesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [suggestions, setSuggestions] = React.useState<Language[]>([]);
  const { addLanguage } = props;

  const pickLanguage = (language: string) => {
    addLanguage(language);
    setValue('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (value.length > 0 && focused) {
      const filteredlanguages = languages.filter((language) =>
        language.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredlanguages);
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
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={suggestions.length > 0}>
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            onClick={() => {
              pickLanguage(suggestion.name);
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

export default LanguagesSelect;
