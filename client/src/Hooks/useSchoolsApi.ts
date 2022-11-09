import {useState} from 'react';

interface School {
    name: string;
    country: string;
    website: string;
}

export const useSchoolsApi = () => {
    const [schools, setSchools] = useState<School[]>([]);

    const baseUrl = 'http://universities.hipolabs.com/search?name='

    const fetchSchools = async (query:string) => {
        const response = await fetch(`${baseUrl}${query}`);
        const data = await response.json();
        setSchools(data);
    }

    return {schools, fetchSchools};
}