import React, { useContext, useState, useEffect, useMemo } from "react";
import "./search.css";
import Education from "./Education";
import Experience from "./Experience";
import YearsOfExperience from "./YearsOfExperience";
import MinMax from "./MinMax";
import Location from "./Location";
import Budget from "./Budget";
import api from "../utils/api";
const Search = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [budget,setBudget] = useState<[number,number]>([0,100]);
    const [yearsOfExperience,setYearsOfExperience] = useState<[number,number]>([0,15]);
    const [education,setEducation] = useState<{}>({});
    const [location,setLocation] = useState<{}>({});
    const getSearch=async()=>{
        console.log(194,{
            params:{
                search,
                budget,
                yearsOfExperience,
                education,
                location
            }
        })
        const res = await api.get("/search/",{
            params:{
                search,
                budget,
                education,
                location
            }
        });
        setResults(res.data);
    };
    const expRange = ()=>{
        // for(let i=0;i<results.length;i++){
        //     if(results[i].experience){
        //         return [0,results[i].experience.length];
        //     }
        // }
        // const min = results.reduce((a,b)=>Math.min(a,b.yearsOfExperience),Infinity);
        // const max = results.reduce((a,b)=>Math.max(a,b.yearsOfExperience),-Infinity);
        // return [min,max];
    }
    useEffect(()=>{
        getSearch();
    },[search,budget,education,location]);
    return (
      <div>
        <div id="top">
            
            {results.length>0&&<YearsOfExperience setValues={setYearsOfExperience} range={yearsOfExperience}/>}
            <Education setValues={setEducation}/>
            <Location setValues={setLocation}/>
            <Budget setValues={setBudget} range={budget}/>
        </div>
        <div id="results"></div>
      </div>
    );
};

export default Search;