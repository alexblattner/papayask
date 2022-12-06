import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import ProfilePicture from '../shared/ProfilePicture';
import { NoteProps } from "../models/Question";
interface Props {
    data:NoteProps;
    // removeNote:Function;
    // editNote:Function;
    // currentNote:NoteProps|null;
    // setCurrentNote:Function;
}
const Note = (props:Props) => {
    const {data}=props;
    console.log(2833,data);
    return (
        <div className="note">
            <div className="top"><ProfilePicture size={50} radius={200} src={data.user?.picture}/><span className="user-name">{data.user?.name}</span></div>
            <div dangerouslySetInnerHTML={{__html:data.content}} />
        </div>
    );
};

export default Note;