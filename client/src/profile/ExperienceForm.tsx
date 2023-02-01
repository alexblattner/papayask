import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import CountriesSelect from '../shared/CountriesSelect';
import { DateInput } from '../shared/DateInput';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { Experience } from './profileService';
import { Company } from '../models/User';
import CompanySelect from '../shared/CompanySelect';
import { useEditProfile } from './profileService';
import { AuthContext } from '../Auth/ContextProvider';
import SvgIcon from '../shared/SvgIcon';

const StyledSelect = styled.select`
  margin-bottom: 30px;
  border: ${({ theme }) => `2px solid ${theme.colors.secondary_L1}`};
  border-radius: 8px;
  padding: 3px 12px;
  -webkit-appearance: none;
  appearance: none;
  background-color: white;
  width: 100%;
  height: 50px;

  :focus {
    outline: none;
    border: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  }
  ::-ms-expand {
    display: none;
  }
`;
const CheckBox = styled.label`
  margin-top: 10px;
  margin-left: 5px;
  margin-bottom: 30px;
  input {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin-bottom: -4px;
    border: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  }
  input:checked:before {
    content: '';
    width: 3px;
    height: 12px;
    border-radius: 2px;
    background: ${({ theme }) => `${theme.colors.primary}`};
    display: inline-block;
    vertical-align: middle;
    transform: rotate(45deg);
    margin-left: 9px;
    margin-top: -9px;
  }
  input:checked:after {
    content: '';
    width: 7px;
    height: 3px;
    border-radius: 2px;
    background: ${({ theme }) => `${theme.colors.primary}`};
    display: inline-block;
    vertical-align: middle;
    transform: rotate(45deg) skew(-20deg);
    margin-left: -10px;
    margin-top: -5.75px;
  }
`;
const StyleOption = styled.option``;

interface Props {
  onAddExperience: () => void;
  onChangeExperience: (
    name: string,
    value:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => void;
  inputExperience: Experience;
  onChangeExperienceCountry: (name: string) => void;
  onChangeExperienceCompany: (company: Company | string) => void;
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
  onChangeExperienceCompany,
  type,
  closeForm,
  isLoading,
  submitExperience,
}: Props) => {
  const typesOptions = ['Employee', 'Owner', 'FreeLancer'];
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { updateUser } = useContext(AuthContext);
  const { deleteExperience, experience } = useEditProfile();

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

  const deleteCurrentExperience = async () => {
    setIsDeleting(true);
    const experienceIndex = experience.findIndex(
      (exp) =>
        exp.name === inputExperience.name &&
        exp.company.name === inputExperience.company.name
    );

    const newExp = experience.filter(
      (exp) =>
        exp.name !== inputExperience.name ||
        exp.company.name !== inputExperience.company.name
    );

    const body = {
      experience: newExp,
    };
    await updateUser(body);
    if (experienceIndex !== -1) {
      deleteExperience(experienceIndex);
    }
    setIsDeleting(false);
    closeForm && closeForm();
  };
  return (
    <>
      <Text fontSize={32} fontWeight={'bold'} mb={16} color="var(--primary)">
        {type === 'Initial' ? '' : type} Experience
      </Text>
      <Container flex dir="column">
        <Input
          type="text"
          value={inputExperience.name}
          label="Position"
          name="name"
          onChange={(e) => onChangeExperience('name', e)}
        />
        <CompanySelect
          value={inputExperience.company.name}
          onChange={onChangeExperienceCompany}
        />
        <Container flex gap={12} align="center">
          <Container flex dir="column" width="100%">
            <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
              Experience type
            </Text>
            <StyledSelect
              value={inputExperience.type}
              onChange={(e) => onChangeExperience('type', e)}
            >
              <StyleOption value="" disabled></StyleOption>
              {typesOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </StyledSelect>
          </Container>
          <CountriesSelect
            value={inputExperience.geographic_specialization}
            onChange={onChangeExperienceCountry}
            inputName="geographic_specialization"
          />
        </Container>
        <Container flex gap={12} align="center">
          <DateInput
            value={inputExperience.startDate}
            onChange={(date) => onChangeExperience('startDate', date)}
            name="startDate"
            label="Start"
            inputExperience={inputExperience}
          />
          <DateInput
            value={inputExperience.endDate}
            onChange={(date) => onChangeExperience('endDate', date)}
            name="endDate"
            label="Finish"
            inputExperience={inputExperience}
          />
        </Container>
        <CheckBox>
          <input
            type="checkbox"
            onChange={() => {
              if (inputExperience.endDate) {
                onChangeExperience('endDate', '');
              }
            }}
            checked={!inputExperience.endDate}
          />
          I am currently working there
        </CheckBox>
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
        <Container width="100%" height="16px" />
        {type === 'Edit' ? (
          <Button
            variant="primary"
            onClick={deleteCurrentExperience}
            disabled={isDeleting}
            color="red"
          >
            <Container flex gap={8} align="center" justify="center">
              <SvgIcon src="delete" />
              Delete Experience
            </Container>
          </Button>
        ) : null}
      </Container>
    </>
  );
};

export default ExperienceForm;
