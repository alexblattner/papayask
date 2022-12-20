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
  border: ${({ theme }) => `1px solid ${theme.colors.primary_L2}`};
  border-radius: 8px;
  padding: 3px 12px;
  width: 60%;
  -webkit-appearance: none;
  appearance: none;
  background-color: white;

  :focus {
    outline: none;
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
      alert(3333)
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
          onChange={(e) => {
            onChangeExperience('company', e)
            alert(222)
            displayCompany(e)
          }}
        />
        <Container flex gap={12} align="center">
          <StyledSelect
            value={inputExperience.type}
            onChange={(e) => onChangeExperience('type', e)}
          >
            <StyleOption
              value=""
              disabled
              selected={inputExperience.type === ''}
            >
              Experience Type
            </StyleOption>
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
            onChange={(date) => onChangeExperience('startDate', date)}
            name="startDate"
            placeholder="Start Date"
            inputExperience={inputExperience}
          />
          <DateInput
            value={inputExperience.endDate}
            onChange={(date) => onChangeExperience('endDate', date)}
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
