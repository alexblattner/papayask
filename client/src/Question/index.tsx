import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';
import Writing from './Writing';
import Image from './Image';
import useDevice from '../Hooks/useDevice';
import { NoteProps, QuestionProps } from '../models/Question';
import api from '../utils/api';
import { AuthContext } from '../Auth/ContextProvider';
function Question() {
  const [data, setData] = useState<QuestionProps | null>(null); //question data
  const [notes, setNotes] = useState<NoteProps[]>([]); //answer data
  const [cutting, setCutting] = useState(false);
  const { device } = useDevice();

  const { token } = React.useContext(AuthContext);
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);
  const loadData = async () => {
    const urlSplit = window.location.pathname.split('/questions/');
    const questionId = urlSplit[1];
    const res = await api.get(`/questions/` + questionId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(292929, res.data);
    setData(res.data);
    setNotes(res.data.notes);
  };
  const postContent = () => {
    if (data?.files && data?.files.length > 0) {
      if (data?.files[0].type == 'image') {
        return (
          <Image file={data?.files[0]} notes={notes} setNotes={setNotes} />
        );
      } else {
        return (
          <Writing file={data?.files[0]} notes={notes} setNotes={setNotes} />
        );
      }
    }
  };
  if (device == 'mobile') {
    return <div></div>;
  } else {
    return (
      <div>
        <>
          <Container
            className={
              `post-border-1 post` +
              (!navigator.userAgent.toLowerCase().match(/mobile/i)
                ? ' unique'
                : '')
            }
          >
            <Row>
              {' '}
              <div className={'description'}>{data?.description}</div>
            </Row>
            {Array.isArray(data?.files) ? postContent() : postContent()}
          </Container>
        </>
        <div id="answer">
          {notes.map((c, i) => (
            <></>
          ))}
        </div>
      </div>
    );
  }
}
export default Question;
