import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../../models/Question";
interface Props {
  notes:NoteProps[],
  description:string,

}

const SideBar = (props:Props) => {
  console.log(333333,props)
    return (
      <div id="answer">{props.notes.map((note, i) => (
      <div className="note">
        {note.coordinates?<div className="quotation">{props.description.substring(note.coordinates.start,note.coordinates.end)}</div>:<></>}
        <div>{note.content}</div>
      </div>))}</div>
    );
};

export default SideBar;