import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import { AuthContext } from '../Auth/ContextProvider';
import SunEditor from 'suneditor-react';
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import api from "../utils/api";
interface Props {
    done:boolean;
    senderId:string;
    addNote:Function;
}
const Input = (props:Props) => {
    const { user } = useContext(AuthContext);

    const [content, setContent] = useState("");
    const editor = useRef<SunEditorCore>();

    // The sunEditor parameter will be set to the core suneditor instance when this function is called
     const getSunEditorInstance = (sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    };
    const submitNote = () => {
        if(content&&!(props.done&&props.senderId===user?.uid)){
            let tempcontent = content;
            
            let submission:any = {
                content:content,
                questionId:window.location.pathname.split("/question/")[1]
            }
            api.post("/note",submission).then((res)=>{
                props.addNote(res.data);
            }).catch((err)=>{
                console.log(err);
                setContent(tempcontent);
            })
            setContent("");
        }
    }
    const config = {
        readonly: false,
        toolbar: true,
        buttons: [
            'bold', 'italic'
        ],
    }
    if(!(props.done&&props.senderId===user?.uid)){
        const defaultStyle:string = "font-family: 'Greycliff CF'"
        return (
            <div id="note-writer">
                <SunEditor setContents={content} onChange={setContent} setDefaultStyle={defaultStyle} setOptions={{
                    height: '200px',
                    font:['Arial','Times New Roman','Verdana','Georgia','Trebuchet MS','Courier New','Impact','Comic Sans MS','Helvetica','Tahoma','Palatino Linotype','Lucida Sans Unicode','MS Serif','MS Sans Serif','Symbol','Webdings','Wingdings','Sans-Serif','Serif','Monospace','Cursive','Fantasy','System'],
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['paragraphStyle', 'blockquote'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link'],
                        ['fullScreen'],
                    ]
                }} getSunEditorInstance={getSunEditorInstance} />
                <button onClick={submitNote}>Add</button>
            </div>
        
        );
    }else{
        return null;
    }
};

export default Input;