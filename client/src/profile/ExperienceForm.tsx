import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import CountriesSelect from '../shared/CountriesSelect';
import { DateInput } from '../shared/DateInput';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { Experience } from './profileService';

const StyledSelect = styled.select`
  margin-bottom: 30px;
  border: ${({ theme }) => `1px solid ${theme.colors.primary_L2}`};
  border-radius: 8px;
  padding: 3px 12px;
  width: 50%;
  -webkit-appearance: none;
  appearance: none;

  :focus {
    outline: none;
  }
  ::-ms-expand {
    display: none;
  }
`;

interface Props {
  onAddExperience: () => void;
  onChangeExperience: (
    name: string,
    value:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  inputExperience: Experience;
  onChangeExperienceCountry: (name: string) => void;
  type: 'Initial' | 'Edit' | 'Add';
  closeForm?: () => void;
  submitExperience?: () => void;
  isLoading?: boolean;
}

const ExperienceForm = ({
  onAddExperience,
  inputExperience,
  onChangeExperience,
  onChangeExperienceCountry,
  type,
  closeForm,
  isLoading,
  submitExperience,
}: Props) => {
  const typesOptions = ['Employee', 'Owner', 'FreeLancer'];
  const addExperienceDisabled = () => {
    return (
      isLoading ||
      !inputExperience.startDate ||
      !inputExperience.company.name ||
      !inputExperience.name ||
      !inputExperience.type ||
      !inputExperience.geographic_specialization
    );
  };

  return (
    <>
      <Text fontSize={32} fontWeight={600} mb={16}>
        {type === 'Initial' ? '' : type} Experience
      </Text>
      <Container flex dir="column">
        <Input
          type="text"
          value={inputExperience.name}
          placeholder="Position"
          name="name"
          onChange={(e) => onChangeExperience('name', e)}
        />
        <Input
          type="text"
          value={inputExperience.company.name}
          placeholder="Company"
          name="company"
          onChange={(e) => onChangeExperience('company', e)}
        />
        <Container flex gap={12} align="center">
          {/* <Input
            type="text"
            value={inputExperience.type}
            placeholder="Experience type"
            name="type"
            onChange={(e) => onChangeExperience('type', e)}
          /> */}
          <StyledSelect
            value={inputExperience.type}
            onChange={(e) => onChangeExperience('type', e)}
          >
            {typesOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </StyledSelect>

          <CountriesSelect
            value={inputExperience.geographic_specialization}
            onChange={onChangeExperienceCountry}
            inputName="geographic_specialization"
          />
        </Container>
        <Container flex gap={12} align="center">
          <DateInput
            value={inputExperience.startDate}
            onChange={(e) => onChangeExperience('startDate', e)}
            name="startDate"
            placeholder="Start Date"
            inputExperience={inputExperience}
          />
          <DateInput
            value={inputExperience.endDate}
            onChange={(e) => onChangeExperience('endDate', e)}
            name="endDate"
            placeholder="End Date"
            inputExperience={inputExperience}
          />
        </Container>
        {closeForm !== undefined && (
          <Button variant="outline" onClick={closeForm}>
            Cancel
          </Button>
        )}
        <Container width="100%" height="16px" />

        <Button
          variant="primary"
          onClick={
            submitExperience !== undefined ? submitExperience : onAddExperience
          }
          disabled={addExperienceDisabled()}
        >
          {isLoading ? 'Please Wait...' : type === 'Edit' ? 'Update' : 'Add'}
        </Button>
      </Container>
    </>
  );
};

export default ExperienceForm;
