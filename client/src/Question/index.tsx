import React, { useRef, useState, useEffect, useContext } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import moment from "moment";
import PDF from "./PDF";
import Image from "./Image";
import useDevice from "../Hooks/useDevice";
import { NoteProps, QuestionProps } from "../models/Question";
import ProfilePicture from "../shared/ProfilePicture";
import api from "../utils/api";
import "./question.css";
import Description from "./Description";
import Input from "./Input";
import Note from "./Note";
import { AuthContext } from "../Auth/ContextProvider";
import { UpdateNote } from "../models/Question";
// interface UpdateNote {
//   updateId: string;
//   updateText: string;
// }

function Question() {
  const { token, user } = useContext(AuthContext);
  const [highlightedNoteId, setHighlightedNoteId] = useState<string>("");
  const [data, setData] = useState<QuestionProps | null>(null); //question data
  const [notes, setNotes] = useState<NoteProps[]>([]); //answer data
  const [updateNote, setUpdateNote] = useState<UpdateNote | null>(null);
  const [cutting, setCutting] = useState(false);
  const { device } = useDevice();
  useEffect(() => {
    if (data === null && user != undefined) {
      loadData();
    }
  }, []);
  useEffect(() => {
    if (data === null && user != undefined && token != undefined) {
      setTimeout(() => {
        loadData();
      }, 100);
    }
  }, [user, token]);

  useEffect(() => {
    console.log("notes", notes);
  }, [notes]);

  const loadData = async () => {
    console.log("notes update");
    const urlSplit = window.location.pathname.split("/question/");
    const questionId = urlSplit[1];
    const res = await api.get(`/question/` + questionId);
    setData(res.data);
    setNotes(res.data.notes);
  };
  const postContent = () => {
    if (data?.files && data?.files.length > 0) {
      if (data?.files[0].type == "image") {
        return (
          <Image file={data?.files[0]} notes={notes} setNotes={setNotes} />
        );
      } else {
        return <PDF file={data?.files[0]} notes={notes} setNotes={setNotes} />;
      }
    }
  };
  const addNote = (note: NoteProps) => {
    setNotes((prev) => [...prev, note]);
  };

  const noteUpdate = (note: NoteProps, index: number): void => {
    setNotes((prev) => {
      const tempNotes: NoteProps[] = prev;
      tempNotes.splice(index, 1, note);
      return [...tempNotes];
    });
  };
  const deleteNote = (index: number): void => {
    setNotes((prev) => {
      const tempNotes: NoteProps[] = prev;
      tempNotes.splice(index, 1);
      return [...tempNotes];
    });
  };
  const finish = () => {
    api
      .post("/question/finish", {
        questionId: window.location.pathname.split("/question/")[1],
      })
      .then((res) => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (device == "mobile") {
    return <div></div>;
  } else {
    return (
      <>
        <div id="question">
          {!data?.status.done && <button onClick={finish}>finished</button>}
          {data ? (
            <div className="note">
              <div className="top">
                <ProfilePicture
                  size={50}
                  radius={200}
                  src={data.sender?.picture}
                />
                <span className="user-name">{data.sender.name}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          ) : null}
          {postContent()}
          {notes.map((note, index) => (
            <Note
              data={note}
              setUpdateNote={setUpdateNote}
              index={index}
              deleteNote={deleteNote}
            />
          ))}
          {data ? (
            <Input
              senderId={data?.sender._id}
              done={data ? data.status.done : true}
              addNote={addNote}
              setUpdateNote={setUpdateNote}
              updateNote={updateNote}
              noteUpdate={noteUpdate}
            />
          ) : null}
        </div>
      </>
    );
  }
}
export default Question;
