import { useState, useContext, useEffect, createContext } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import api from '../utils/api';
import {
  Company,
  University,
  UserEducation,
  UserExperience,
  UserSkill,
} from '../models/User';

export interface Education {
  university: University;
  name: string;
  level: string;
  startDate: Date | null;
  endDate: Date | string | null;
}

export interface Experience {
  company: Company;
  name: string;
  startDate: Date | null;
  endDate: Date | string | null;
  type: string;
  geographic_specialization: string;
}

interface EditProfileContextReturn {
  name: string;
  title: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditProfileShown: React.Dispatch<React.SetStateAction<boolean>>;
  editProfileShown: boolean;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  skills: UserSkill[];
  setSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  languages: string[];
  setLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  setCloudinaryImageId: React.Dispatch<React.SetStateAction<string>>;
  progress: number;
  education: UserEducation[];
  setEducation: React.Dispatch<React.SetStateAction<UserEducation[]>>;
  inputEducation: Education;
  experience: UserExperience[];
  setExperience: React.Dispatch<React.SetStateAction<UserExperience[]>>;
  inputExperience: Experience;
  submit: () => Promise<void>;
  addEducation: (education: Education) => void;
  addExperience: (experience: Experience) => void;
  removeEducation: (index: number) => void;
  removeExperience: (index: number) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  onChangeEducation: (name: string, value: string | University | Date) => void;
  onChangeExperience: (
    name: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => void;
  onChangeExperienceDate: (name: string, date: Date | string | null) => void;
  onChangeCountry: (country: string) => void;
  onChangeExperienceCountry: (country: string) => void;
  onChangeExperienceCompany: (company: Company | string) => void;
  removeSkill: (index: number) => void;
  becomeAdvisor: () => Promise<any>;
  addSkill: () => void;
  updateSkills: () => Promise<void>;
  selectedExperienceIndexes: number[];
  setSelectedExperienceIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  selectedEducationIndexes: number[];
  setSelectedEducationIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  currentSkill: UserSkill;
  setCurrentSkill: React.Dispatch<React.SetStateAction<UserSkill>>;
  inputSkillName: string;
  setInputSkillName: React.Dispatch<React.SetStateAction<string>>;
}

export const EditProfileContext = createContext<EditProfileContextReturn>({
  name: '',
  title: '',
  setName: () => {},
  setTitle: () => {},
  setEditProfileShown: () => {},
  editProfileShown: false,
  image: '',
  setImage: () => {},
  bio: '',
  setBio: () => {},
  skills: [],
  setSkills: () => {},
  languages: [],
  setLanguages: () => {},
  country: '',
  setCountry: () => {},
  setCloudinaryImageId: () => {},
  progress: 0,
  education: [],
  setEducation: () => {},
  inputEducation: {
    university: {
      name: '',
      country: '',
      rank: 1800,
      logo: '',
    },
    name: '',
    level: '',
    startDate: null,
    endDate: null,
  },
  experience: [],
  setExperience: () => {},
  inputExperience: {
    company: { name: '' },
    name: '',
    startDate: null,
    endDate: null,
    type: '',
    geographic_specialization: '',
  },

  submit: async () => {},
  addEducation: () => {},
  addExperience: () => {},
  removeEducation: (index: number) => {},
  removeExperience: (index: number) => {},
  addLanguage: (language: string) => {},
  removeLanguage: (language: string) => {},
  onChangeEducation: (name: string, value: string | University | Date) => {},
  onChangeExperience: (
    name: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => {},
  onChangeExperienceDate: (name: string, date: Date | string | null) => {},
  onChangeCountry: (country: string) => {},
  onChangeExperienceCountry: (country: string) => {},
  onChangeExperienceCompany: (company: Company | string) => {},
  removeSkill: (index: number) => {},
  becomeAdvisor: async () => {},
  addSkill: () => {},
  updateSkills: async () => {},
  selectedExperienceIndexes: [],
  setSelectedExperienceIndexes: () => {},
  selectedEducationIndexes: [],
  setSelectedEducationIndexes: () => {},
  currentSkill: {
    name: '',
    educations: [],
    experiences: [],
  },
  inputSkillName: '',
  setInputSkillName: () => {},
  setCurrentSkill: () => {},
});

export const useEditProfile = () => useContext(EditProfileContext);

export const EditProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const { user, updateUser } = useContext(AuthContext);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [country, setCountry] = useState<string>('');
  const [cloudinaryImageId, setCloudinaryImageId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [editProfileShown, setEditProfileShown] = useState<boolean>(false);
  const [inputEducation, setInputEducation] = useState<Education>({
    university: {
      name: '',
      _id: '',
      country: '',
      rank: 1800,
      logo: '',
    },
    level: '',
    name: '',
    startDate: null,
    endDate: null,
  });
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [inputExperience, setInputExperience] = useState<Experience>({
    company: { name: '' },
    name: '',
    startDate: null,
    endDate: null,
    type: '',
    geographic_specialization: '',
  });
  const [inputSkillName, setInputSkillName] = useState<string>('');

  const [selectedExperienceIndexes, setSelectedExperienceIndexes] = useState<
    number[]
  >([]);
  const [selectedEducationIndexes, setSelectedEducationIndexes] = useState<
    number[]
  >([]);

  const [currentSkill, setCurrentSkill] = useState<UserSkill>({
    name: '',
    educations: [],
    experiences: [],
  });

  const numberOfYears = (field: UserEducation | UserExperience): number => {
    const startMonth = new Date(field.startDate).getMonth() + 1;
    const endMonth = field.endDate
      ? new Date(field.endDate).getMonth() + 1
      : new Date().getMonth() + 1;

    const startYear = new Date(field.startDate).getFullYear();
    const endYear = field.endDate
      ? new Date(field.endDate).getFullYear()
      : new Date().getFullYear();

    let diff = (endMonth - startMonth + 12 * (endYear - startYear)) / 12;

    let formatedDiff = diff.toFixed(1);

    if (formatedDiff.includes('.0')) {
      formatedDiff = formatedDiff.replace('.0', '');
    }

    diff = parseFloat(formatedDiff);

    return diff;
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const updateSkills = async () => {
    try {
      await updateUser({ skills });
    } catch (error) {
      console.log(error);
    }
  };

  const addSkill = () => {
    if (!user) return;
    let educationList: UserEducation[] = [];
    selectedEducationIndexes.forEach((index) => {
      educationList.push(education[index]);
    });

    let experienceList: UserExperience[] = [];

    selectedExperienceIndexes.forEach((index) => {
      experienceList.push(experience[index]);
    });

    let skillsNames = inputSkillName.split(',').map((s) => s.trim());
    if (skillsNames[skillsNames.length - 1] === '') {
      skillsNames = skillsNames.slice(0, skillsNames.length - 1);
    }
    const newSkills: UserSkill[] = [];
    skillsNames.forEach((skillName) => {
      const skillIndex = skills.findIndex((skill) => skill.name === skillName);
      if (skillIndex !== -1) {
        const newSkills = skills.splice(skillIndex, 1);
        setSkills([...newSkills]);
      }
      const skill: UserSkill = {
        name: skillName,
        educations: educationList.map((edu) => ({
          education: edu,
          years: numberOfYears(edu),
        })),
        experiences: experienceList.map((exp) => ({
          experience: exp,
          years: numberOfYears(exp),
        })),
      };
      newSkills.push(skill);
    });
    setSkills([...skills, ...newSkills]);
    setCurrentSkill({
      name: '',
      educations: [],
      experiences: [],
    });
    setSelectedEducationIndexes([]);
    setSelectedExperienceIndexes([]);
  };

  const onChangeEducation = (
    name: string,
    value: string | University | Date
  ) => {
    if (value instanceof Object && !(value instanceof Date)) {
      setInputEducation({
        ...inputEducation,
        university: value,
      });
    } else if (name.includes('university')) {
      name = name.split('-')[1];

      setInputEducation({
        ...inputEducation,
        university: {
          ...inputEducation.university,
          [name]: value,
        },
      });
    } else {
      setInputEducation({
        ...inputEducation,
        [name]: value,
      });
    }
  };

  const onChangeCountry = (country: string) => {
    setInputEducation({
      ...inputEducation,
      university: {
        ...inputEducation.university,
        country,
      },
    });
  };

  const onChangeExperience = (
    name: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | Date
      | string
  ) => {
    if (name === 'startDate' || name === 'endDate') {
      setInputExperience({
        ...inputExperience,
        [name]: event,
      });
    } else {
      setInputExperience({
        ...inputExperience,
        [name]: (
          event as
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
        ).target.value,
      });
    }
  };
  async function getUniversityLogo(universityName: string): Promise<string> {
    // Replace spaces in the university name with underscores for the API request
    const encodedName = universityName.replace(/ /g, '_');

    try {
      // Make a request to the Wikipedia API to retrieve the university's logo
      const response = await api.get(`/university_logo/${encodedName}`);

      // Get the URL for the logo
      const logoUrl: string = response.data;

      // Return the logo URL
      return logoUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const addEducation = async (inputEducation: Education) => {
    if (!inputEducation.startDate) {
      return;
    }
    let tempUniversity = inputEducation.university;
    tempUniversity.logo = await getUniversityLogo(
      inputEducation.university.name
    );
    const newEducation: UserEducation = {
      university: tempUniversity,
      level: inputEducation.level,
      name: inputEducation.name,
      startDate: inputEducation.startDate,
      endDate: inputEducation.endDate || undefined,
    };
    setEducation([...education, newEducation]);
    setInputEducation({
      university: { name: '', _id: '', country: '', rank: 1800, logo: '' },
      name: '',
      level: '',
      startDate: null,
      endDate: null,
    });
  };

  const addExperience = (inputExperience: Experience) => {
    if (!inputExperience.startDate) {
      return;
    }
    const newExperience: UserExperience = {
      company: inputExperience.company,
      name: inputExperience.name,
      startDate: inputExperience.startDate,
      endDate: inputExperience.endDate || undefined,
      geographic_specialization: inputExperience.geographic_specialization,
      type: inputExperience.type,
    };
    setExperience([...experience, newExperience]);
    setInputExperience({
      company: { name: '' },
      name: '',
      startDate: null,
      endDate: null,
      type: '',
      geographic_specialization: '',
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const removeExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const addLanguage = (language: string) => {
    setLanguages([...languages, language]);
  };

  const removeLanguage = (text: string) => {
    const newLanguages = [...languages];
    const index = newLanguages.indexOf(text);
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
  };

  const onChangeExperienceCountry = (country: string) => {
    setInputExperience({
      ...inputExperience,
      geographic_specialization: country,
    });
  };

  const onChangeExperienceCompany = (company: Company | string) => {
    if (company instanceof Object) {
      setInputExperience({
        ...inputExperience,
        company,
      });
    } else {
      setInputExperience({
        ...inputExperience,
        company: {
          name: company,
        },
      });
    }
  };

  const onChangeExperienceDate = (name: string, date: Date | string | null) => {
    setInputExperience({
      ...inputExperience,
      [name]: date,
    });
  };
  const submit = async () => {
    try {
      await updateUser({
        name,
        title,
        bio,
        skills,
        education,
        experience,
        languages,
        country,
        picture: cloudinaryImageId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const becomeAdvisor = async () => {
    return await api({
      method: 'post',
      url: `confirmation-application`,
    });
  };

  useEffect(() => {
    if (user) {
      setBio(user.bio);
      setSkills(user.skills);
      setEducation(user.education);
      setExperience(user.experience);
      setName(user.name ?? '');
      setTitle(user.title ?? '');
      setLanguages(user.languages);
      setCountry(user.country);

      if (user.picture) {
        setImage(`cloudinary-${user.picture}`);
        setCloudinaryImageId(user.picture);
      }
    }
  }, [user]);

  useEffect(() => {
    setProgress(0);
    const titleProgress = title ? 5 : 0;
    const bioProgress = bio ? 15 : 0;
    const skillsProgress = skills.reduce((acc, skill) => {
      if (skill.educations.length > 0 || skill.experiences.length > 0) {
        return acc + 10;
      } else {
        return acc + 5;
      }
    }, 0);
    const educationProgress = education.length * 5;
    const experienceProgress = experience.length * 5;
    const languagesProgress = languages.length > 0 ? 5 : 0;
    const countryProgress = country ? 5 : 0;
    const pictureProgress = cloudinaryImageId ? 15 : 0;

    const progressSum =
      titleProgress +
      bioProgress +
      skillsProgress +
      educationProgress +
      experienceProgress +
      languagesProgress +
      countryProgress +
      pictureProgress;

    setProgress(progressSum > 100 ? 100 : progressSum);
  }, [
    name,
    title,
    bio,
    skills,
    education,
    experience,
    languages,
    country,
    cloudinaryImageId,
  ]);

  const value: EditProfileContextReturn = {
    name,
    title,
    setName,
    setTitle,
    bio,
    setBio,
    skills,
    setSkills,
    education,
    setEducation,
    experience,
    setExperience,
    languages,
    setLanguages,
    country,
    setCountry,
    image,
    setImage,
    progress,
    submit,
    addEducation,
    addExperience,
    removeEducation,
    removeExperience,
    addLanguage,
    removeLanguage,
    onChangeEducation,
    onChangeExperience,
    onChangeCountry,
    onChangeExperienceCountry,
    onChangeExperienceCompany,
    onChangeExperienceDate,
    inputEducation,
    inputExperience,
    setEditProfileShown,
    editProfileShown,
    removeSkill,
    setCloudinaryImageId,
    becomeAdvisor,
    addSkill,
    updateSkills,
    selectedEducationIndexes,
    setSelectedEducationIndexes,
    selectedExperienceIndexes,
    setSelectedExperienceIndexes,
    currentSkill,
    setCurrentSkill,
    inputSkillName,
    setInputSkillName,
  };
  return (
    <EditProfileContext.Provider value={value}>
      {children}
    </EditProfileContext.Provider>
  );
};
