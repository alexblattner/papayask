import {UserProps} from './User';
export type FileProps = {
    id: string,
    name: string,
    type: string
}
export type QuestionProps = {
    _id: string,
    files?: FileProps[],
    sender: UserProps,
    receiver: UserProps,
    description: string,
    createdAt: string,
    uptedAt: string,
    status: {
        action: 'pending' | 'accepted' | 'rejected',
        reason?: string,
        done: boolean,
    }
}
type DescriptionCoordinates = {
    start: number,
    end: number,
}
type TextCoordinates = {
    left: number,
    top: number,
    width: number,
    height: number,
    pageIndex: number,
}
type ImageCoordinates = {
    x: number,
    y: number,
    width: number,
    height: number
}
export type NoteProps = {
    user?: UserProps,
    content: string,
    coordinates: DescriptionCoordinates | null,
    order?: number,
    question?: string | QuestionProps,
    createdAt?: string,
    updatedAt?: string,
}
