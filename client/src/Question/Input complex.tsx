import React, { useContext, useState, useEffect } from "react";
import { NoteProps } from "../models/Question";
import api from "../utils/api";
interface Props {
  description: string;
  addNote: Function;
  currentNote: NoteProps | null;
  removeCurrentNote: Function;
}
const Input = (props: Props) => {
  const [content, setContent] = useState("");
  const submitNote = () => {
    if (content.length > 0) {
      let tempcontent = content;
      let submission: any = {
        content: content,
        questionId: window.location.pathname.split("/question/")[1],
      };
      if (props.currentNote && props.currentNote.coordinates) {
        submission.coordinates = props.currentNote.coordinates;
      }
      api
        .post("/note", submission)
        .then((res) => {
          props.addNote(res.data);
          props.removeCurrentNote();
        })
        .catch((err) => {
          console.log(err);
          setContent(tempcontent);
        });
      setContent("");
    }
  };
  return (
    <div id="note-writer">
      {props.currentNote && (
        <div>
          <div>
            {props.currentNote.coordinates
              ? props.description.substring(
                  props.currentNote.coordinates.start,
                  props.currentNote.coordinates.end
                )
              : null}
          </div>
          <button onClick={() => props.removeCurrentNote()}>Remove</button>
        </div>
      )}
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
      />
      <button onClick={submitNote}>Add</button>
    </div>
  );
};

export default Input;
