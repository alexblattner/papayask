import CountriesSelect from '../shared/CountriesSelect';
import LanguagesSelect from '../shared/LanguagesSelect';
import Badge from './components/Badge';
import { Container } from './components/Container';
import { Text } from './components/Text';

interface Props {
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  languages: string[];
  country: string;
  setCountry: (country: string) => void;
}

const StepFour = (props: Props) => {
  return (
    <>
      <Text fontSize={32} fontWeight="bold" mb={16}>
        Geographic Specialization
      </Text>
      <CountriesSelect
        value={props.country}
        onChange={props.setCountry}
        inputName=""
      />
      <LanguagesSelect addLanguage={props.addLanguage} />
      <Container flex flexWrap gap={12} mb={36}>
        {props.languages.map((language, index) => (
          <Badge
            key={index}
            text={language}
            isRemovable={true}
            onRemove={props.removeLanguage}
          ></Badge>
        ))}
      </Container>
    </>
  );
};

export default StepFour;
