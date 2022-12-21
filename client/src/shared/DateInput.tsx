import styled from 'styled-components';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

import { Education, Experience } from '../profile/profileService';

const StyledInput = styled('input')`
  all: unset;
  height: 33px;
  font-weight: 500;
  width: 80%;
  padding-left: 15px;
  font-size: 12px;
`;

const Wrapper = styled.div<{ value: string; placeholder: string }>`
  height: 35px;
  width: 50%;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
  border-radius: 8px;
  position: relative;
  background-color: transparent;
  margin-bottom: 30px;
  padding-top: 4px;

  &::before {
    content: ${(props) => (!props.value ? 'attr(placeholder)' : 'none')};
    position: absolute;
    left: 15px;
    width: calc(100% - 60px);
    color: #aaa;
    background-color: white;
    transition: all 0.2s;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};

    &::before {
      content: none;
    }
  }
`;

const CustomInput = styled.input`
  height: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;

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
  placeholder: string;
  inputEducation?: Education;
  inputExperience?: Experience;
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
    <DatePicker
      selected={date}
      onChange={(date) => changeDate(date)}
      customInput={<CustomInput />}
      minDate={new Date(minDate())}
      maxDate={new Date(maxDate())}
      placeholderText={`${props.placeholder} (dd/mm/yyyy)`}
      adjustDateOnChange={true}
      dateFormat="dd/MM/yyyy"
      scrollableYearDropdown
      showYearDropdown
      yearDropdownItemNumber={100}
      autoComplete="off"
    />
  );
};
