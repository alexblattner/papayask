import React, {useEffect,useState} from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import CountriesSelect from '../shared/CountriesSelect';
import { DateInput } from '../shared/DateInput';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { Experience } from './profileService';
import axios from 'axios';
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
  const [accessToken,setAccessToken]=useState('')
  useEffect(() => {
    if(accessToken!='') return

    const getAccessToken = async () => {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          grant_type: 'client_credentials',
          client_id: process.env.REACT_APP_LINKEDIN_KEY,
          client_secret: process.env.REACT_APP_LINKEDIN_SECRET,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
      console.log(22222,response);
      setAccessToken(response.data.access_token)
      
    };
    getAccessToken();
  }, []);

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
  const displayCompany = async (e:any) => {
    let val=e.target.value 
    const response = await axios.get(
      'https://api.linkedin.com/v2/search',
      {
        params: {
          q: val,
          type: 'companies',
          sortBy: 'relevance',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(7777788888,response)
  }

  return (
    <>
      <Text fontSize={32} fontWeight={'bold'} mb={16} color= 'var(--primary)'>
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
        <Input
          type="text"
          value={inputExperience.company.name}
          label="Company"
          name="company"
          onChange={(e) => {
            onChangeExperience('company', e)
            alert(222)
            displayCompany(e)
          }}
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
