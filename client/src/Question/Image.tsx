import React, { useRef, useState, useEffect } from "react";
import {FileProps,NoteProps} from './Question.types';

type ImageProps = {
  file: FileProps,
  notes: NoteProps[],
  setNotes: Function,
}

const Image = (props: ImageProps ) => {
    
    return (
      <>
      {props.file}
      {/* <DrawingBox
        data={data}
        cuts={cuts}
        drawing={cutting}
        setDrawing={setCutting}
        /> */}
      </>
    );
};

export default Image;