import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Max from "./Max";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import arrow from "./arrow.svg";
import { OptionsInput } from "../shared/OptionsInput";

interface Props {
  setValues: Function;
}
const Education = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    const [rank,setRank]=useState<number>(100);
    const [schools,setSchools]=useState<UniversityProps[]>([]);
    const [degree,setDegree]=useState<string>("");
    const [results,setResults]=useState<string[]>([]);
    const [searchVal,setSearchVal]=useState<string>("");
    const educationSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchVal(value)
        if(value.length>0){
          const res = await api.get("/university/"+value);
          setResults(res.data);
        }else{
          setResults([]);
        }
    }
    const addUniversity = (school:UniversityProps) => {
        setSchools([...schools,school]);
        setResults([]);
        setSearchVal("");
    }
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
            <input type="text" value={searchVal} onChange={educationSearch} placeholder="Search for university expert studied at"/>
            {results.map((result:any)=><div onClick={()=>addUniversity(result)}>{result.name}</div>)}
          </div>
        </div>
        <div>
          <span>University Rank</span>
          <Max value={rank} setValue={setRank} min={1} step={1} max={1800}/>
        </div></>}
      </div>
    );
};

export default Education;