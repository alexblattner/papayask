import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Button } from "../shared/Button";
import ProfilePicture from "../shared/ProfilePicture";
import { NoteProps, UpdateNote } from "../models/Question";
import SvgIcon from "../shared/SvgIcon";
import api from "../utils/api";
interface Props {
  data: NoteProps;
  setUpdateNote: Function;
  index: number;
  deleteNote: Function;
  // removeNote:Function;
  // editNote:Function;
  // currentNote:NoteProps|null;
  // setCurrentNote:Function;
}

const Note = (props: Props) => {
  const { data, setUpdateNote, index, deleteNote } = props;

  const handleDeleteClick = () => {
    api
      .delete(`/note/${data._id}`)
      .then((res) => {
        deleteNote(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateClick = () => {
    setUpdateNote({
      updateId: data._id,
      updateText: data.content,
      updateIndex: index,
    });
  };
  return (
    <div className="note">
      <div className="top">
        <ProfilePicture size={50} radius={200} src={data.user?.picture} />
        <span className="user-name">{data.user?.name}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
      <Button variant="text" onClick={handleUpdateClick}>
        <SvgIcon src="edit_black" size={15} />
      </Button>
      <Button variant="text" onClick={handleDeleteClick}>
        <SvgIcon src="delete" size={15} />
      </Button>
    </div>
  );
};

export default Note;
