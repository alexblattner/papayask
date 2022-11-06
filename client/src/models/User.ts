export interface UserProps {
    id: string;
    confirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
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
    skills: string[];
    experience: string[];
    education: string[];
}