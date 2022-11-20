import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Max from "./Max";
import api from "../utils/api";
import { University } from "../models/User";
import arrow from "./arrow.svg";
import { OptionsInput } from "../shared/OptionsInput";
import { setConstantValue } from "typescript";

interface Props {
  values: any;
  setValues: Function;
  degrees: string[];
  universities: University[];
}
const Education = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    const [rank,setRank]=useState<number>(0);
    const [rankRange,setRankRange]=useState<[number,number]>([1,100]);//[min,max]
    const [schools,setSchools]=useState<University[]>([]);//available schools
    const [school,setSchool]=useState<University|null>(null);//selected school
    const [degrees,setDegrees]=useState<string[]>(props.degrees);//available degrees
    const [degree,setDegree]=useState<string|null>(null);//selected degree
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
    const addUniversity = (school:University) => {
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
        let displaySchools:University[]=[];
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
    useEffect(()=>{
      const ob=props.values?props.values:{}
      if(school!==null){
        ob["univesity"]=school
      }
      if(degree!==null){
        ob["degree"]=degree
      }
      if(rank!==0){

        ob["rank"]=rank==rankRange[1]?null:rank//if max rank, set to null
      }
      props.setValues({...ob})
    },[school,rank,degree])
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
          {rankRange[0]<=rankRange[1]&&<Max value={rank} setValue={setRank} min={rankRange[0]} step={1} max={rankRange[1]}/>}
        </div></>}
      </div>
    );
};

export default Education;