import React, { useContext, useState, useEffect, useMemo } from "react";
import "./search.css";
import Education from "./Education";
import Experience from "./Experience";
import YearsOfExperience from "./YearsOfExperience";
import MinMax from "./MinMax";
import Location from "./Location";
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
    useEffect(()=>{
        getSearch();
    },[search,budget,education,location]);
    return (
      <div>
        <div id="top">
            <div>
                <span>Budget</span>
                <MinMax values={budget} step={100/100} setValues={setBudget} min={0} max={100}/>
            </div>
            <YearsOfExperience setValues={setYearsOfExperience} range={yearsOfExperience}/>
            <Education setValues={setEducation}/>
            <Location setValues={setLocation}/>
        </div>
        <div id="results"></div>
      </div>
    );
};

export default Search;