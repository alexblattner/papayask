import React, { useEffect } from 'react';

import { Company } from '../models/User';
import { Container } from './Container';
import { Input } from './Input';
import { Text } from './Text';
import api from '../utils/api';
import { Suggestions, Suggestion } from './Suggestions';

interface Props {
  value: string;
  companies?: Company[];
  onChange: (value: string | Company) => void;
}

const CompanySelect = (props: Props) => {
  const [focused, setFocused] = React.useState<boolean>(false);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const { value, onChange } = props;

  useEffect(() => {

    if (value !== '' && focused) {
      if (props.companies) {
        setCompanies(props.companies);
      } else {
        api.get(`/company/${value}`).then((res) => {
          setCompanies(res.data.companies);
        });
      }
    } else {
      setTimeout(() => {
        setCompanies([]);
      }, 200);
    }
  }, [value, focused]);

  return (
    <Container position="relative">
      <Input
        type="text"
        value={value}
        label="company"
        name="company"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <Suggestions show={companies.length > 0}>
        {companies.map((company, index) => (
          <Suggestion key={index} onClick={() => onChange(company)}>
            <Text fontSize={14} fontWeight={'bold'}>
              {company.name}
            </Text>
          </Suggestion>
        ))}
      </Suggestions>
    </Container>
  );
};

export default CompanySelect;
