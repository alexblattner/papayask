import React, { useRef, useState, useEffect, useContext } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import moment from "moment";
import PDF from "./PDF";
import SideBar from "./Answer/SideBar";
import Image from "./Image";
import useDevice from "../Hooks/useDevice";
import {NoteProps,QuestionProps} from '../models/Question';
import api from '../utils/api';
import './question.css';
import Description from "./Description";
import Input from "./Input";
import { AuthContext } from "../Auth/ContextProvider";
function Question() {
  const {token,user} = useContext(AuthContext);
  const [data, setData] = useState<QuestionProps | null>(null); //question data
  const [notes, setNotes] = useState<NoteProps[]>([]); //answer data
  const [currentNote, setCurrentNote] = useState<NoteProps | null>(null); //current note
  const [cutting, setCutting] = useState(false);
  const { device } = useDevice();
  useEffect(() => {
    if (data===null&&user!=undefined) {
      loadData();
    }
  }, []);
  useEffect(() => {
    if (data===null&&user!=undefined) {
      loadData();
    }
  }, [user]);
  const loadData=async()=>{
    const urlSplit = window.location.pathname.split("/question/");
    const questionId = urlSplit[1];
    const res = await api.get(`/question/`+questionId);
    setData(res.data);
    setNotes(res.data.notes);
  }
  const postContent = () => {
    if(data?.files&&data?.files.length>0){
      if(data?.files[0].type=="image"){
      return (<Image
        file={data?.files[0]}
        notes={notes}
        setNotes={setNotes}
      />)
      }else{
        return (<PDF
          file={data?.files[0]}
          notes={notes}
          setNotes={setNotes}
        />)
      }
    }
  };
  const removeCurrentNote = () => {
    setCurrentNote(null);
  }
  const addNote = (note:NoteProps) => {
    setNotes([...notes,note]);
  }
  if (device == "mobile") {
    return (
        <div></div>
    );
  } else {
    return (
          <>
            <div
              id="question"
            >
              <Row>
                {" "}
                {data?.description!=undefined&&<Description description={data?.description} notes={notes} setCurrentNote={setCurrentNote}/>}
              </Row>
                {postContent()}
            </div>
            {notes&&data?.description&&<SideBar description={data?.description} notes={notes}/>}
            {data?.description&&<Input description={data.description} currentNote={currentNote} addNote={addNote} removeCurrentNote={removeCurrentNote}/>}
          </>
    );
  }
}
export default Question;
