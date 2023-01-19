import { useState } from 'react';

interface University {
  name: string;
  country: string;
  website: string;
}

export const useUniversitysApi = () => {
  const [universitys, setUniversitys] = useState<University[]>([]);

  const baseUrl = 'http://universities.hipolabs.com/search?name=';

  const fetchUniversitys = async (query: string) => {
    const response = await fetch(`${baseUrl}${query}`);
    const data = await response.json();
    setUniversitys(data);
  };

  return { universitys, fetchUniversitys };
};
