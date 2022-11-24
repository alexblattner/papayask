import styled from 'styled-components';
import { Education, Experience } from '../profile/ProfileSetup';

const StyledInput = styled('input')`
  width: 193px;
  height: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary_L2};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  background-color: transparent;
  position: relative;

  &::before {
    content: ${(props) => (!props.value ? 'attr(placeholder)' : 'none')};
    position: absolute;
    height: 100%;
    left: 15px;
    width: calc(100% - 50px);
    padding-top: 4px;
    color: #aaa;
    background-color: white;
    transition: all 0.2s;
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};

    &::before {
      content: none;
    }
  }
`;

interface InputProps {
  name: string;
  value: Date | null | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    day = dateArr[2];
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }
  return `${year}-${month}-${day}`;
};

export const DateInput = (props: InputProps) => {
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
  return (
    <StyledInput
      {...props}
      value={formatedDate(props.value)}
      type="date"
      max={maxDate()}
      min={minDate()}
      onChange={(e) => {
        props.onChange(e);
      }}
    />
  );
};
