import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../models/Question";
import api from "../utils/api";
interface Props {
    addNote:Function;
    currentNote:NoteProps|null;
    removeCurrentNote:Function;
}
const Input = (props:Props) => {
    const [content, setContent] = useState("");
    const submitNote = () => {
        if(content.length>0){
            api.post("/note",{
                content:content,
                questionId:window.location.pathname.split("/question/")[1]
            }).then((res)=>{
                props.addNote(res.data);
                setContent("");
            })
        }
    }
    return (
        <div id="note-writer">
            {props.currentNote && <div>
                <div>{props.currentNote.description}</div>
                <button onClick={() => props.removeCurrentNote()}>Remove</button>
            </div>}
            <input value={content} onChange={(e)=>setContent(e.target.value)} type="text"/><button onClick={submitNote}>Add</button>
        </div>
      
    );
};

export default Input;