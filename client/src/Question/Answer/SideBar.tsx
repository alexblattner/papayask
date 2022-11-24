import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../../models/Question";
interface Props {
  notes:NoteProps[]
}

const SideBar = (props:Props) => {
    return (
      <div id="answer">{props.notes.map((c, i) => (<></>))}</div>
    );
};

export default SideBar;