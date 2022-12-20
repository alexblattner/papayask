import styled from 'styled-components';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

import { Education, Experience } from '../profile/profileService';
import { Text } from './Text';
import { Container } from './Container';

const CustomInput = styled.input`
  height: 15px;
  border: 2px solid ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  width: 100%;

  &::placeholder {
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

interface InputProps {
  name: string;
  value: Date | null | string;
  onChange: (date: string | Date) => void;
  error?: string;
  placeholder?: string;
  inputEducation?: Education;
  inputExperience?: Experience;
  label?: string;
}

const formatedDate = (date: Date | null | string): string => {
  if (!date) return '';
  let year: number | string;
  let month: number | string;
  let day: number | string;
  if (typeof date === 'string') {
    const dateArr = date.split('-');
    year = dateArr[0];
    month = dateArr[1];
    day = dateArr[2].slice(0, 2);
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }

  return `${year}-${month}-${day}`;
};

export const DateInput = (props: InputProps) => {
  const [date, setDate] = useState<Date | null>(null);

  const changeDate = (date: Date | null) => {
    if (date) {
      props.onChange(date);
    }
  };

  const minDate = () => {
    let date = '1977-01-01';
    if (props.name.includes('end')) {
      if (props.inputExperience) {
        if (props.inputExperience.startDate) {
          date = formatedDate(props.inputExperience.startDate);
        }
      }
      if (props.inputEducation) {
        if (props.inputEducation.startDate) {
          date = formatedDate(props.inputEducation.startDate);
        }
      }
    }
    return date;
  };

  const maxDate = () => {
    let date = formatedDate(new Date());
    if (props.name.includes('start')) {
      if (props.inputExperience) {
        if (props.inputExperience.endDate) {
          date = formatedDate(props.inputExperience.endDate);
        }
      }
      if (props.inputEducation) {
        if (props.inputEducation.endDate) {
          date = formatedDate(props.inputEducation.endDate);
        }
      }
    }

    return date;
  };

  useEffect(() => {
    if (props.value) {
      setDate(new Date(formatedDate(props.value)));
    }
  }, [props.value]);

  return (
    <Container width='100%'>
      <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
        {props.label}
      </Text>
      <DatePicker
        selected={date}
        onChange={(date) => changeDate(date)}
        customInput={<CustomInput />}
        minDate={new Date(minDate())}
        maxDate={new Date(maxDate())}
        placeholderText={`(dd/mm/yyyy)`}
        adjustDateOnChange={true}
        dateFormat="dd/MM/yyyy"
        scrollableYearDropdown
        showYearDropdown
        yearDropdownItemNumber={100}
        autoComplete="off"
      />
    </Container>
  );
};
