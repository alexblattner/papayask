import styled from 'styled-components';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { Education, Experience } from '../profile/profileService';
import { Text } from './Text';
import { Container } from './Container';

const CustomInput = styled.input`
  height: 50px;
  border: 2px solid ${(props) => props.theme.colors.secondary_L1};
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  width: 100%;

  &::placeholder {
    font-size: 18px;
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

const HeaderSelect = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;

  select {
    border: none;
    background: white;
    font-size: 16px;
    font-weight: 500;
    border-radius: 5px;
    padding: 5px 10px;
    width: 150px;
  }

  button {
    border: none;
    background: none;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    color: ${(props) => props.theme.colors.primary};
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
  const [date, setDate] = useState<Date | undefined>(undefined);

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
      setDate(new Date(props.value));
    } else {
      setDate(undefined);
    }
  }, [props.value]);

  return (
    <Container width="100%">
      <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
        {props.label}
      </Text>
      <DatePicker
        selected={date ? date : undefined}
        onChange={(date) => changeDate(date)}
        customInput={<CustomInput />}
        minDate={new Date(minDate())}
        maxDate={new Date(maxDate())}
        placeholderText={`dd/mm/yyyy`}
        adjustDateOnChange={true}
        dateFormat="dd-MM-yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        dropdownMode="scroll"
        renderCustomHeader={(params) => (
          <CustomHeader
            params={params}
            minDate={minDate()}
            maxDate={maxDate()}
            setDate={setDate}
          />
        )}
        autoComplete="off"
      />
    </Container>
  );
};

interface CustomHeaderProps {
  params: ReactDatePickerCustomHeaderProps;
  minDate: string;
  maxDate: string;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const CustomHeader = ({
  params: { date, decreaseYear, increaseYear, increaseMonth, decreaseMonth },
  minDate,
  maxDate,
  setDate,
}: CustomHeaderProps) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = [];
  const startYear = parseInt(minDate.split('-')[0], 10);
  const endYear = parseInt(maxDate.split('-')[0], 10);

  for (let i = startYear; i <= endYear; i++) {
    years.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    date.setMonth(newMonth);
    setDate(date);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    date.setFullYear(newYear);
    setDate(date);
  };

  return (
    <div className="">
      <HeaderSelect>
        <button onClick={decreaseMonth}>{'<'}</button>
        <select value={date.getMonth()} onChange={handleMonthChange}>
          {months.map((monthName, index) => (
            <option key={index} value={index}>
              {monthName}
            </option>
          ))}
        </select>
        <button onClick={increaseMonth}>{'>'}</button>
      </HeaderSelect>
      <HeaderSelect>
        <button onClick={decreaseYear}>{'<<'}</button>
        <select value={date.getFullYear()} onChange={handleYearChange}>
          {years}
        </select>
        <button onClick={increaseYear}>{'>>'}</button>
      </HeaderSelect>
    </div>
  );
};
