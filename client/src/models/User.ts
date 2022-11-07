export interface UserExperience {
    position: string;
    company: string;
    years: String;
}

export interface UserEducation {
    school: string;
    fieldOfStudy: string;
    years: String;
}

export interface UserSkill {
    name: string;
    relatedEducation: string;
    relatedExperience: string;
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
}