import { useContext } from 'react';

import CountriesSelect from '../shared/CountriesSelect';
import LanguagesSelect from '../shared/LanguagesSelect';
import Badge from '../shared/Badge';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import { useEditProfile } from './profileService';


const StepFour = () => {
  const { addLanguage, removeLanguage, languages, country, setCountry } = useEditProfile()
  return (
    <>
      <Text fontSize={32} fontWeight="bold" mb={16}>
        Geographic Specialization
      </Text>
      <CountriesSelect
        value={country ?? ''}
        onChange={setCountry}
        inputName=""
        width="300px"
      />
      <LanguagesSelect addLanguage={addLanguage} width="300px" />
      <Container flex flexWrap gap={12} mb={36}>
        {languages.map((language, index) => (
          <Badge
            key={index}
            text={language}
            isRemovable={true}
            onRemove={removeLanguage}
          ></Badge>
        ))}
      </Container>
    </>
  );
};

export default StepFour;
