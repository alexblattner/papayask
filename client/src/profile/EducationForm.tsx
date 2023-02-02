import { University } from '../models/User';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import CountriesSelect from '../shared/CountriesSelect';
import { DateInput } from '../shared/DateInput';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import UniversitiesSelect from '../shared/UniversitiesSelect';
import { Education } from './profileService';
import SvgIcon from '../shared/SvgIcon';

import styled from 'styled-components';

const CloseButton = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-weight: bold;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

interface Props {
  onAddEducation: (education: Education) => void;
  onChangeEducation: (name: string, value: string | University | Date) => void;
  inputEducation: Education;
  onChangeCountry: (name: string) => void;
  type: 'Initial' | 'Edit' | 'Add';
  closeForm?: () => void;
  submitEducation?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  deleteCurrentEducation?: () => void;
}

const EducationForm = ({
  onAddEducation,
  onChangeEducation,
  inputEducation,
  onChangeCountry,
  type,
  closeForm,
  submitEducation,
  isLoading,
  isDeleting,
  deleteCurrentEducation,
}: Props) => {
  const addEducationDisabled = () => {
    return (
      isLoading ||
      !inputEducation.startDate ||
      !inputEducation.name ||
      !inputEducation.level ||
      !inputEducation.university.name ||
      !inputEducation.university.country
    );
  };

  const closeModal = () => {
    if (closeForm) {
      closeForm();
    }
  };

  return (
    <>
      <Container
        flex
        width="100%"
        justify="space-between"
        align="center"
        mb={24}
      >
        <Text fontSize={32} fontWeight={'bold'} mb={16} color="primary">
          {type === 'Initial' ? '' : type} Education
        </Text>
        <Container flex align="center">
          {type === 'Edit' ? (
            <Button
              variant="text"
              onClick={deleteCurrentEducation}
              disabled={isDeleting}
              color="red"
            >
              <Container flex gap={8} align="center" justify="center">
                <SvgIcon src="delete" color="primary" />
              </Container>
            </Button>
          ) : null}
          <CloseButton onClick={closeModal}>
            <SvgIcon src="close" color="white" size={12} />
          </CloseButton>
        </Container>
      </Container>
      <Container flex dir="column">
        <Container flex gap={8}>
          <Input
            type="text"
            value={inputEducation.name}
            label="field of study"
            name="name"
            width="70%"
            onChange={(e) => onChangeEducation('name', e.target.value)}
          />
          <Input
            type="text"
            label="Level"
            name="level"
            width="30%"
            value={inputEducation.level}
            onChange={(e) => onChangeEducation('level', e.target.value)}
          />
        </Container>

        <UniversitiesSelect
          value={inputEducation.university.name}
          onChange={onChangeEducation}
        />

        <CountriesSelect
          value={inputEducation.university.country}
          onChange={onChangeCountry}
          inputName="university-country"
        />

        <Container flex gap={12} align="center">
          <DateInput
            value={inputEducation.startDate}
            onChange={(date) => onChangeEducation('startDate', date)}
            name="startDate"
            label="Start Date"
            inputEducation={inputEducation}
          />
          <DateInput
            value={inputEducation.endDate}
            onChange={(date) => onChangeEducation('endDate', date)}
            name="endDate"
            label="End Date"
            inputEducation={inputEducation}
          />
        </Container>

        <Button
          variant="primary"
          onClick={
            submitEducation !== undefined
              ? submitEducation
              : () => onAddEducation(inputEducation)
          }
          disabled={addEducationDisabled()}
        >
          {isLoading ? 'Please Wait...' : type === 'Edit' ? 'Update' : 'Add'}
        </Button>
      </Container>
    </>
  );
};

export default EducationForm;
