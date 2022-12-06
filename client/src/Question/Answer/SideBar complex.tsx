import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../../models/Question";
import api from "../../utils/api";
interface Props {
  highlight: string;
  setHighlight: Function;
  notes:NoteProps[],
  description:string,

}

const SideBar = (props:Props) => {
    const clicked=(id:string|undefined)=>{
      if(id){
        let toScrollTo=document.getElementById("highlight-holder")?.querySelector("[data-id='"+id+"']");
        if(toScrollTo){
            toScrollTo.scrollIntoView({behavior:"smooth",block:"center"});
        }
      }
    }
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
          {note.coordinates?<div onClick={()=>clicked(note._id)} onMouseLeave={()=>props.setHighlight("")} onMouseEnter={()=>props.setHighlight(note._id)} className={"quotation"+(note._id==props.highlight?" hover":"")}>{props.description.substring(note.coordinates.start,note.coordinates.end)}</div>:<></>}
          <div>{note.content}</div>
        </div>))}
      </div>
    );
};

export default SideBar;