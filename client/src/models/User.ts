
export interface School {
    id?: string;
    name: string;
    country: string;
    rank?: number;
}

export interface Company {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    country?: string;
    members?: UserProps[];
    foundingDate?: Date;
    closedDate?: Date;
}

export interface UserExperience {
    position: string;
    company: Company;
    years: String;
}

export interface UserEducation {
    school: School;
    fieldOfStudy: string;
    years: String;
}

export interface RelatedExperience {
    experience: UserExperience;
    years: number
}

export interface RelatedEducation {
    education: UserEducation;
    years: number
}

export interface UserSkill {
    name: string;
    relatedEducation:  RelatedEducation[];
    relatedExperience: RelatedExperience[];
    totalEducationYears?: number;
    totalExperienceYears?: number;
}

export interface UserProps {
    id: string;
    confirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    uid: string;
    name: string;
    reputation: number;
    requestCount: number;
    isSetUp: boolean;
    bio : string;
    email: string;
    picture: string;
    coverPicture: string;
    social: string[];
    skills: UserSkill[];
    experience: UserExperience[];
    education: UserEducation[];
    lastLogIn: Date;
}