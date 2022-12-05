import React, { useContext, useState, useEffect, useRef } from "react";
import { NoteProps } from "../models/Question";

interface Props {
    description:string;
}
// export type NoteProps = {
//     user: UserProps,
//     description: string,
//     coordinates: TextCoordinates[] | ImageCoordinates[] | null,
//     order: number|undefined,
//     question: string | QuestionProps,
//     createdAt: string | undefined,
//     uptedAt: string | undefined,
// }
const Description = (props:Props) => {
    const {description}=props;
    return (
        <div id="description">
            {description}
        </div>
    );
};

export default Description;
