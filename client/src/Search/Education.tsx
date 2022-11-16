import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Max from './Max';
import api from '../utils/api';
import { UniversityProps } from '../models/University';
const Education = () => {
  const [rank, setRank] = useState<number>(100);
  const [universitys, setUniversitys] = useState<UniversityProps[]>([]);
  const [degree, setDegree] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [searchVal, setSearchVal] = useState<string>('');
  const educationSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchVal(value);
    if (value.length > 0) {
      const res = await api.get('/university/' + value);
      setResults(res.data);
    } else {
      setResults([]);
    }
  };
  const addUniversity = (university: UniversityProps) => {
    setUniversitys([...universitys, university]);
    setResults([]);
    setSearchVal('');
  };
  return (
    <div className="filter-popup">
      <div>Education</div>
      <div>
        <span>Education Level</span>
        <select>
          <option value="any">Any</option>
          <option value="certificated">Course and above</option>
          <option value="bachelors">Bachelors and above</option>
          <option value="masters">Masters and above</option>
          <option value="phd">PhD</option>
        </select>
      </div>
      <div>
        <span>Degree</span>
        <input type="text" placeholder="Search for subject expert studied" />
      </div>
      <div>
        <span>University</span>
        <div>
          <input
            type="text"
            value={searchVal}
            onChange={educationSearch}
            placeholder="Search for university expert studied at"
          />
          {results.map((result: any) => (
            <div onClick={() => addUniversity(result)}>{result.name}</div>
          ))}
        </div>
      </div>
      <div>
        <span>University Rank</span>
        <Max value={rank} setValue={setRank} min={1} step={1} max={1800} />
      </div>
    </div>
  );
};

export default Education;
