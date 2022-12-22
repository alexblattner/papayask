import React, { useEffect } from 'react';

import { University } from '../models/User';
import { Container } from './Container';
import { Input } from './Input';
import { Text } from './Text';
import api from '../utils/api';
import axios from 'axios';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  value: string;
  universities?: University[];
  onChange: (name: string, value: string | University) => void;
  adder?: (value: University) => void;
}

const UniversitiesSelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [universities, setUniversities] = React.useState<University[]>([]);
  const { value, onChange } = props;

  useEffect(() => {
    if (value !== '' && focused) {
      if (props.universities) {
        setUniversities(props.universities);
      } else {
        api.get(`/university/${value}`).then((res) => {
          setUniversities(res.data);
        });
      }
    } else {
      setTimeout(() => {
        setUniversities([]);
      }, 200);
    }
  }, [value, focused]);
  async function getUniversityLogo(universityName: string): Promise<string> {
    // Replace spaces in the university name with underscores for the API request
    const encodedName = universityName.replace(/ /g, '_');
  
    try {
      // Make a request to the Wikipedia API to retrieve the university's logo
      const response = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages&titles=${encodedName}&pithumbsize=200`);
  
      // Get the page ID for the university
      const pageId = Object.keys(response.data.query.pages)[0];
  
      // Get the URL for the logo
      const logoUrl: string = response.data.query.pages[pageId].thumbnail.source;
  
      // Return the logo URL
      return logoUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return (
    <Container position="relative">
      <Input
        type="text"
        value={value}
        label="University"
        name="university-name"
        onChange={(e) => onChange('university-name', e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={universities.length > 0}>
        {universities.map((university, index) => (
          <Suggestion
            key={index}
            onClick={async() => {
              if (university.logo === '') {
                university.logo = await getUniversityLogo(university.name);
              }
              onChange('university-name', university);
              if (props.adder) {
                props.adder(university);
              }
              setUniversities([]);
            }}
          >
            <Text fontSize={14} fontWeight={'bold'}>
              {university.name}
            </Text>
            <Text fontSize={13}>{university.country}</Text>
          </Suggestion>
        ))}
      </Suggestions>
    </Container>
  );
};

export default UniversitiesSelect;
