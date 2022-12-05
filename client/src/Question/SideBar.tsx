import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../models/Question";
import api from "../utils/api";
import Input from "./Input";
interface Props {
  notes:NoteProps[],
  description:string,
  addNote:Function,
  senderId:string,
  done:boolean,
}

const SideBar = (props:Props) => {
    
    const finish=()=>{
      api.post("/question/finish",{
        questionId:window.location.pathname.split("/question/")[1]
      }).then((res)=>{
        window.location.href="/";
      }).catch((err)=>{
        console.log(err);
      })
    }
    return (
      <div id="answer">
        <button onClick={finish}>finished</button>
        {props.notes.map((note, i) => (
        <div className="note">
          <div dangerouslySetInnerHTML={{__html:note.content}} />
        </div>))}
        <Input senderId={props.senderId} done={props.done} description={props.description} addNote={props.addNote}/>
      </div>
    );
};

export default SideBar;