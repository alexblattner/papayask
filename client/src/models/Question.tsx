import { type } from '@testing-library/user-event/dist/type';
import {UserProps} from './User';
export type FileProps = {
    id: string,
    name: string,
    type: string
}
export type QuestionProps = {
    files: FileProps[],
    sender: UserProps,
    receiver: UserProps,
    description: string,
    createdAt: string,
    uptedAt: string,
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
    description: string,
    coordinates: TextCoordinates[] | ImageCoordinates[] | DescriptionCoordinates | null,
    order?: number,
    question?: string | QuestionProps,
    createdAt?: string,
    updatedAt?: string,
}
