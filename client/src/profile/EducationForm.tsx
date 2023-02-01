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
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';
import { useContext, useState } from 'react';

interface Props {
  onAddEducation: (education: Education) => void;
  onChangeEducation: (name: string, value: string | University | Date) => void;
  inputEducation: Education;
  onChangeCountry: (name: string) => void;
  type: 'Initial' | 'Edit' | 'Add';
  closeForm?: () => void;
  submitEducation?: () => void;
  isLoading?: boolean;
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
}: Props) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { deleteEducation, education } = useEditProfile();
  const { updateUser } = useContext(AuthContext);

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

  const deleteCurrentEducation = async () => {
    setIsDeleting(true);
    const educationIndex = education.findIndex(
      (edu) =>
        edu.name === inputEducation.name &&
        edu.university.name === inputEducation.university.name
    );
    

    const body = {
      education: education.filter(
        (edu) =>
          edu.name !== inputEducation.name ||
          edu.university.name !== inputEducation.university.name 
      ),
    };
    if (educationIndex !== -1) {
      deleteEducation(educationIndex);
    }

    await updateUser(body);
    setIsDeleting(false);
    closeForm && closeForm();
  };

  return (
    <>
      <Text fontSize={32} fontWeight={'bold'} mb={16} color="primary">
        {type === 'Initial' ? '' : type} Education
      </Text>
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
        {closeForm !== undefined && (
          <Button variant="outline" onClick={closeForm}>
            Cancel
          </Button>
        )}
        <Container width="100%" height="16px" />
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
        <Container width="100%" height="16px" />
        {type === 'Edit' ? (
          <Button
            variant="primary"
            onClick={deleteCurrentEducation}
            disabled={isDeleting}
            color="red"
          >
            <Container flex gap={8} align="center" justify="center">
              <SvgIcon src="delete" />
              Delete Education
            </Container>
          </Button>
        ) : null}
      </Container>
    </>
  );
};

export default EducationForm;
