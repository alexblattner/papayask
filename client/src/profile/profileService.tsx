import { useState, useContext, useEffect, createContext } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
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
  title: string;
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
  removeSkill: (index: number) => void;
}

export const EditProfileContext = createContext<EditProfileContextReturn>({
  title: '',
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
  removeSkill: (index: number) => {},
});

export const useEditProfile = () => useContext(EditProfileContext);

export const EditProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
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
    if (name === 'company') {
      setInputExperience({
        ...inputExperience,
        company: {
          name: (
            event as
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLSelectElement>
          ).target.value,
        },
      });
    } else if (name === 'startDate' || name === 'endDate') {
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

  const addEducation = (inputEducation: Education) => {
    if (!inputEducation.startDate) {
      return;
    }

    const newEducation: UserEducation = {
      university: {
        name: inputEducation.university.name,
        _id: inputEducation.university._id,
        country: inputEducation.university.country,
        rank: inputEducation.university.rank,
      },
      level: inputEducation.level,
      name: inputEducation.name,
      startDate: inputEducation.startDate,
      endDate: inputEducation.endDate || undefined,
    };
    setEducation([...education, newEducation]);
    setInputEducation({
      university: { name: '', _id: '', country: '', rank: 1800 },
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

  const onChangeExperienceDate = (name: string, date: Date | string | null) => {
    setInputExperience({
      ...inputExperience,
      [name]: date,
    });
  };
  const submit = async () => {
    try {
      await updateUser({
        isSetUp: progress > 75 ? true : false,
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

  useEffect(() => {
    if (user) {
      setBio(user.bio);
      setSkills(user.skills);
      setEducation(user.education);
      setExperience(user.experience);
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
    title,
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
    onChangeExperienceDate,
    inputEducation,
    inputExperience,
    setEditProfileShown,
    editProfileShown,
    removeSkill,
    setCloudinaryImageId,
  };
  return (
    <EditProfileContext.Provider value={value}>
      {children}
    </EditProfileContext.Provider>
  );
};
