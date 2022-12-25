

export interface RequestSettings {
  concurrent: number;
  cost: number;
  time_limit: {
    days: number;
    hours: number;
  };
}

export interface University {
  _id?: string;
  name: string;
  country: string;
  rank: number;
  logo?: string;
}

export interface Company {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  emil?: string;
  country?: string;
  members?: UserProps[];
  foundingDate?: Date;
  closedDate?: Date;
}

export interface UserExperience {
  name: string;
  company: Company;
  startDate: Date;
  endDate?: Date | string;
  type: string;
  geographic_specialization: string;
}

export interface UserEducation {
  university: University;
  name: string;
  level: string;
  startDate: Date;
  endDate?: Date | string;
}

export interface RelatedExperience {
  experience: UserExperience;
  years: number;
}

export interface RelatedEducation {
  education: UserEducation;
  years: number;
}

export interface UserSkill {
  _id?: string;
  name: string;
  educations: RelatedEducation[];
  experiences: RelatedExperience[];
  totalEducationYears?: number;
  totalExperienceYears?: number;
}

export type AdvisorStatus = 'pending' | 'approved' | boolean;

export interface UserProps {
  _id: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  uid: string;
  name: string;
  reputation: number;
  requestCount: number;
  bio: string;
  email: string;
  picture?: string;
  coverPicture: string;
  social: string[];
  skills: UserSkill[];
  experience: UserExperience[];
  education: UserEducation[];
  lastLogIn: Date;
  languages: string[];
  country: string;
  request_settings: RequestSettings;
  questionsInstructions?: string;
  advisorStatus: AdvisorStatus;
}
