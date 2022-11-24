import React, { useContext, useState, useEffect,useRef } from "react";
import { NoteProps } from "../models/Question";
interface Props {
    notes:NoteProps[];
    setCurrentNote:(note:NoteProps|null)=>void;
    description:string;
}
// export type NoteProps = {
//     user: UserProps,
//     description: string,
//     coordinates: TextCoordinates[] | ImageCoordinates[] | null,
//     order: number|undefined,
//     question: string | QuestionProps,
//     createdAt: string | undefined,
//     uptedAt: string | undefined,
// }
const Description = (props:Props) => {
    const {description,notes,setCurrentNote}=props;
    const descRef=useRef<HTMLDivElement>(null);
    const [selectedNote,setSelectedNote]=useState<NoteProps|null>(null);
    useEffect(()=>{
        console.log(8758,notes)
    },[notes])
    const clickOutside=(e:any)=>{
        if(descRef.current?.getAttribute("locked")=='false'){
            window.removeEventListener("click", clickOutside);
            window.removeEventListener("click", clickOutside);
            window.removeEventListener("click", clickOutside);
            window.removeEventListener("click", clickOutside);
            setSelectedNote(null);
            removeSelection();
        }else{
            removeLock();
        }
    }
    const removeLock=()=>{
        descRef.current?.setAttribute("locked",'false');
    }
    function removeSelection(){
        if(descRef.current){
            const selectedNode=descRef.current.querySelector(`.selectedNode`);
            if(selectedNode){
                selectedNode.querySelector('button')?.remove();
                let inner=selectedNode.innerHTML;
                var doc = new DOMParser().parseFromString(inner, "text/xml");
                selectedNode?.replaceWith(inner);
                removeLock();
            }
        }
    }
    useEffect(()=>{
        console.log(333333,descRef.current?.getAttribute("locked"))
        if(selectedNote&&descRef.current?.getAttribute("locked")=='true'){
            window.removeEventListener("click", clickOutside);
            window.addEventListener("click", clickOutside);
            const selectedNode=descRef.current.querySelector(`[style="background-color: yellow;"]`);
            selectedNode?.setAttribute("style",'')
            selectedNode?.setAttribute("class","selectedNode")
            const button=document.createElement("button");
            button.setAttribute("class","removeNoteButton");
            button.innerHTML="Quote";
            
            button.addEventListener("click",()=>{
                props.setCurrentNote(selectedNote)
                removeSelection();
                removeLock();
            })
            selectedNode?.appendChild(button);
        }
    },[selectedNote])
    function makeEditableAndHighlight(colour:string) {
        var range, sel = window.getSelection();
        if (sel?.rangeCount && sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range&&sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        // Use HiliteColor since some browsers apply BackColor to the whole block
        if (!document.execCommand("HiliteColor", false, colour)) {
            document.execCommand("BackColor", false, colour);
        }
        document.designMode = "off";
    }
    function highlight() {
        let colour="yellow";
        try {
            if (!document.execCommand("BackColor", false, colour)) {
                makeEditableAndHighlight(colour);
            }
        } catch (ex) {
            makeEditableAndHighlight(colour)
        }
    }
    return (
        <div
            id="description"
            ref={descRef}
            
            onMouseUp={()=>{
                const selection = window.getSelection();
                if (selection) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const start=range.startOffset;
                    const end=range.endOffset;
                    if(start!=end){
                        const note:NoteProps={
                            description:selection.toString(),
                            coordinates:{
                                start,
                                end
                            },
                        }
                        descRef.current?.setAttribute("locked","true")
                        setSelectedNote(note);
                        highlight();
                    }
                }
            }}
        >
          {description}
      </div>
    );
};

export default Description;