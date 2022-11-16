import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Max from "./Max";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import arrow from "./arrow.svg";
import { OptionsInput } from "../shared/OptionsInput";
import { setConstantValue } from "typescript";

interface Props {
  values: any;
  setValues: Function;
  degrees: string[];
  universities: UniversityProps[];
}
const Education = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    const [rank,setRank]=useState<number>(1);
    const [rankRange,setRankRange]=useState<[number,number]>([1,100]);//[min,max]
    const [schools,setSchools]=useState<UniversityProps[]>([]);//available schools
    const [school,setSchool]=useState<UniversityProps|null>(null);//selected school
    const [degrees,setDegrees]=useState<string[]>(props.degrees);//available degrees
    function escapeRegex(text:string) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const rankSetter= ()=>{
        let min=1800;
        let max=1;
        console.log(777,props.universities);
        for(let i=0;i<props.universities.length;i++){
            if(props.universities[i].rank>max){
                max=props.universities[i].rank;
            }else if(props.universities[i].rank<min){
                min=props.universities[i].rank;
            }
        }
        setRank(max)
        setRankRange([min,max])
    }
    const addUniversity = (school:UniversityProps) => {
      const ob=props.values
      ob["university"]=school
      props.setValues(ob)
    }
    const universitySearch = (e: { target: { value: string; }; }) => {
      const value = e.target.value;
      if(value===""){
        setSchools([]);
      }else{
        const regex = new RegExp(escapeRegex(value), "gi");
        let displaySchools:UniversityProps[]=[];
        for(let i=0;i<props.universities.length;i++){
          if(props.universities[i].name.match(regex)){
            displaySchools.push(props.universities[i]);
          }
        }
        setSchools(displaySchools);
      }
    }
    useEffect(()=>{
        rankSetter();
    },[])
    return (
      <div  className="filter-popup">
        <button onClick={()=>setMenu(!menu)}>Education<img className={menu?"upside-down":""} src={arrow} /></button>
        {menu&&<>      
        <div>
          <span>Degree</span><br/>
          <input type="text" placeholder="Search for subject expert studied"/>
        </div>
        <div>
          <span>University</span>
          <div>
            <input type="text" onChange={universitySearch} placeholder="Search for university expert studied at"/>
            {schools.map((school:any)=><div onClick={()=>addUniversity(school)}>{school.name}</div>)}
          </div>
        </div>
        <div>
          <span>University Rank</span>
          <Max value={rank} setValue={setRank} min={rankRange[0]} step={1} max={rankRange[1]}/>
        </div></>}
      </div>
    );
};

export default Education;