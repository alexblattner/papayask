import React, { useContext, useState, useEffect,useRef } from "react";
import { NoteProps } from "../models/Question";

interface Props {
    highlight: string,
    setHighlight: (highlight:string) => void,
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
    function nthReplace(str:string, find:string, replace:string, nth:number) {
        let nthcount = 0;
        let regex=new RegExp(find,"g");
        return str.replace(regex, function (match, i, original) {
            let temp=nthcount
            nthcount++;
            return ((nth === temp+1)||(nth==0&&temp==0)) ? replace : match;
        });
        //return str.replace(RegExp("^(?:.*?" + find + "){" + nth + "}"), x => x.replace(RegExp(find + "$"), replace));
    }
    useEffect(()=>{
        if(descRef.current&&descRef.current.innerHTML.length>0){
            descRef.current.parentElement?.querySelectorAll(".highlight").forEach((el)=>{
                el.remove()
            })
            let occured:any={};
            var style = window.getComputedStyle(descRef.current);
            var lineHeight = style.getPropertyValue('line-height');
            for(let i=0; i<notes.length; i++){
                if(props.notes[i].coordinates){
                    let coordinates=notes[i].coordinates;
                    if(coordinates){
                        let start=coordinates.start;
                        let end=coordinates.end;
                        let firstHalf=descRef.current.innerHTML.substring(0,start);
                        let secondHalf=descRef.current.innerHTML.substring(end);
                        let text:string=description.substring(start,end);
                        let repetition=description.substring(0,start).match(new RegExp(text, "g"))?.length;
                        console.log("repetition",text,repetition);
                        let newHtml=nthReplace(descRef.current.innerHTML,text,`<span class="tempSpan">${text}</span>`,repetition?repetition:0);
                        descRef.current.innerHTML=newHtml;
                        let addedSpan=descRef.current.querySelector(".tempSpan") as HTMLSpanElement;
                        console.log(123,text);
                        console.log(3322994,addedSpan);
                        console.log(3322994,addedSpan?.offsetWidth);
                        console.log(3322994,addedSpan?.offsetTop);
                        console.log(3322994,addedSpan?.offsetLeft);
                        let spanParts:string[]=[];
                        addedSpan.innerHTML=text[0];
                        let tempHeight:number = addedSpan.offsetHeight;
                        let breakpoint=0
                        for(var j = 1; j < text.length; j++){
                            addedSpan.innerHTML='';
                            let helperP=document.createElement("span");
                            helperP.style.display="inline";
                            helperP.innerHTML=text.substring(0,j);
                            addedSpan.appendChild(helperP);
                            addedSpan.innerHTML+=text.substring(j,text.length);
                            console.log(10101010,addedSpan.innerHTML,helperP.clientHeight);
                            let newH=addedSpan.querySelector("span")?.offsetHeight;
                            console.log(10101010,addedSpan.innerHTML,helperP.clientHeight,newH);
                            
                            if(j==1&&newH){
                                tempHeight=newH;
                            }else if(newH&&newH > tempHeight){
                                tempHeight = newH;
                                spanParts.push(text.substring(breakpoint,j-1));
                                console.log("breakpoint",breakpoint,j,text,spanParts);
                                
                                breakpoint=j;
                            }
                        }
                        spanParts.push(text.substring(breakpoint-1,text.length));
                        console.log("breakpoint",breakpoint,text,spanParts);
                        addedSpan.innerHTML=""
                        
                        for(let j=0; j<spanParts.length; j++){
                            let temp=document.createElement("span");
                            temp.className="innerTemp";
                            temp.innerHTML=spanParts[j];
                            addedSpan.appendChild(temp);
                        }
                        console.log(987,spanParts,addedSpan.outerHTML);
                        
                        let innerTemp=Array.from(addedSpan.querySelectorAll("span"));
                        for(let j=0; j<innerTemp.length; j++){
                            console.log(innerTemp[j].innerHTML,innerTemp[j].offsetWidth,innerTemp[j].offsetHeight);
                            
                            let highlight=document.createElement("div");
                            highlight.className="highlight";
                            highlight.style.height="16px";
                            highlight.style.width=innerTemp[j].offsetWidth+"px";
                            highlight.style.top=innerTemp[j].offsetTop+"px";
                            highlight.style.left=innerTemp[j].offsetLeft+"px";
                            highlight.setAttribute("data-id",notes[i]._id!=undefined?notes[i]._id+"":"");
                            descRef.current.parentElement?.querySelector("#highlight-holder")?.appendChild(highlight);
                        }
                        descRef.current.innerHTML=props.description
                        
                    }
                }
            }
        }
    },[props.notes,descRef])
    const clickOutside=(e:any)=>{
        if(descRef.current?.getAttribute("locked")=='false'&&e.target.className!="quoteNoteButton"){
                window.removeEventListener("click", clickOutside);
                setSelectedNote(null);
                removeSelection();
        }else if(e.target.className=="quoteNoteButton"){
            window.removeEventListener("click", clickOutside);
        }
    }
    const removeLock=()=>{
        descRef.current?.setAttribute("locked",'false');
    }
    function removeSelection(){
        if(descRef.current){
            const selectedNodes=descRef.current.querySelectorAll(`.selectedNode`);//all selected nodes including the ones inside other highlights
            descRef.current.querySelector(`button`)?.remove();
            setTimeout(()=>{
                if(selectedNodes&&descRef.current){
                    let spans:HTMLSpanElement[]=[];
                    for(let i=0; i<selectedNodes.length; i++){//iterate through all user selected nodes
                        console.log(10,selectedNodes[i].querySelector('span'));
                        if(selectedNodes[i].querySelector('span')!=null&&selectedNodes[i].querySelector('span')?.className!="highlight"){//if the selected node has a span inside it
                            console.log(1);
                            
                            let innerHTML:string=selectedNodes[i].querySelector('span')?.innerHTML as string;//get the innerHTML of the span
                            selectedNodes[i].querySelector('span')?.replaceWith(innerHTML);//replace the span with its innerHTML
                        }else if(selectedNodes[i].querySelector('span')!=null){
                            console.log(2);
                            let tempSpans=Array.from(selectedNodes[i].querySelectorAll('span'));
                            for(let j=0; j<tempSpans.length; j++){//copy original spans
                                spans.push(tempSpans[j].cloneNode(true) as HTMLSpanElement);
                            }
                            for(let i=0; i<tempSpans.length; i++){//remove original spans to survive the innerHTML replacement
                                tempSpans[i].replaceWith("!!replace!!");//replace the span with a string
                            }
                        }
                        
                        let innerHTMLofSelection:string=selectedNodes[i].innerHTML;//get the innerHTML of the selected node
                        selectedNodes[i].replaceWith(innerHTMLofSelection);//replace the selected node with its innerHTML
                    }
                    console.log(1010101010,spans);
                    
                    let ogSpans=[]//array of all the correct spans (some spans have !!replace!! in them)
                    for(let i=0; i<spans.length; i++){
                        if(spans[i].innerHTML!="!!replace!!"){
                            ogSpans.push(spans[i]);
                        }
                    }
                    let newHtmlArr=descRef.current.innerHTML.split(/!!replace!!/g);
                    
                    let newHtml="";
                    for(let i=0; i<newHtmlArr.length; i++){
                        newHtml+=newHtmlArr[i]+(ogSpans[i]?ogSpans[i].outerHTML:"");
                    }
                    descRef.current.innerHTML=newHtml;
                    removeLock();
                }
            },100)
        }
    }
    useEffect(()=>{
        descRef.current?.parentElement?.querySelectorAll('.highlighted')?.forEach((node)=>{
            node.classList.remove('highlighted');
        })
        if(props.highlight){
            let highlights=descRef.current?.parentElement?.querySelectorAll(".highlight");
            if(highlights){
                for(let i=0; i<highlights.length; i++){
                    if(highlights[i].getAttribute("data-id")==props.highlight){
                        highlights[i].classList.add("highlighted");
                    }
                }
            }
        }
                
                    
    },[props.highlight])
    useEffect(()=>{
        if(selectedNote&&descRef.current?.getAttribute("locked")=='false'&&!document.querySelector(".quoteNoteButton")){
            descRef.current?.setAttribute("locked",'true');
            setTimeout(() => {
                window.removeEventListener("click", clickOutside);
                window.addEventListener("click", clickOutside);
                removeLock()
            }, 10);
            const selectedNodes=descRef.current.querySelectorAll(`[style="background-color: yellow;"]`);
            window.getSelection()?.removeAllRanges();
            
            if(selectedNodes.length>0){
                let lastNodeIndex:number=selectedNodes.length-1;
                for(let i=0; i<selectedNodes.length; i++){
                    selectedNodes[i].setAttribute("style",'')
                    selectedNodes[i].classList.add("selectedNode");
                }
                
                const button=document.createElement("button");
                button.setAttribute("class","quoteNoteButton");
                button.innerHTML="Quote";
                
                button.addEventListener("click",()=>{
                    descRef.current?.setAttribute("locked",'true');
                    props.setCurrentNote(selectedNote)
                    removeLock();
                    removeSelection();
                })

                selectedNodes[lastNodeIndex].appendChild(button);
            }
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
    function exactRange(element:HTMLElement) {
        var caretOffset = [0,0];
        var doc = element.ownerDocument
        var win = doc.defaultView
        var sel;
        if (win&&typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel&&sel.rangeCount > 0) {
                var range = win?win.getSelection()?.getRangeAt(0):null;
                if(range){
                    var startCaretRange = range.cloneRange();
                    var endCaretRange = range.cloneRange();
                    startCaretRange.selectNodeContents(element);
                    endCaretRange.selectNodeContents(element);
                    endCaretRange.setEnd(range.endContainer, range.endOffset);
                    startCaretRange.setEnd(range.startContainer, range.startOffset);
                    
                    caretOffset[0] = startCaretRange.toString().length;
                    caretOffset[1] = endCaretRange.toString().length;
                }
            }
        }
        return caretOffset;
    }
    const highlightMark=(e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        let mouseX=e.clientX;
        let mouseY=e.clientY;
        let highlights:HTMLElement[]=Array.from(document.querySelectorAll(".highlight"));
        let chosenHighlight:any=null;
        for(let i=0; i<highlights.length; i++){
            let highlight=highlights[i];
            let rect=highlight.getBoundingClientRect();
            if(mouseX>=rect.left&&mouseX<=rect.right&&mouseY>=rect.top&&mouseY<=rect.bottom){
                if(!chosenHighlight||(chosenHighlight&&highlight&&chosenHighlight.offsetWidth>highlight.offsetWidth)){
                    chosenHighlight=highlight;
                }
            }
        }
        if(chosenHighlight){
            let noteId=chosenHighlight.getAttribute("data-id");
            if(noteId){
                props.setHighlight(noteId);
            }
        }
    }
    return (
        <div>
            <div id="highlight-holder"></div>
            <div
                id="description"
                ref={descRef}
                onMouseMove={highlightMark}
                onMouseLeave={()=>{props.setHighlight("")}}
                onMouseUp={()=>{
                    const selection = window.getSelection();
                    if (selection) {
                        let range=exactRange(descRef.current as HTMLElement);
                        if(range[0]!=range[1]){
                            const note:NoteProps={
                                content:selection.toString(),
                                coordinates:{
                                    start:range[0],
                                    end:range[1]
                                },
                            }
                            descRef.current?.setAttribute("locked","false")
                            setSelectedNote(note);
                            highlight();
                        }
                    }
                }}
            >
            {description}
        </div>
      </div>
    );
};

export default Description;