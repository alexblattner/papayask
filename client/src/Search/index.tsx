import React, { useContext, useState, useEffect } from "react";
import "./search.css";
import Education from "./Education";
import Experience from "./Experience";
import MinMax from "./MinMax";
import Personal from "./Personal";
import api from "../utils/api";
const Search = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [budget,setBudget] = useState<[number,number]>([0,100]);
    const [experience,setExperience] = useState<{}>({});
    const [showExperience,setShowExperience] = useState<boolean>(false);
    const [education,setEducation] = useState<{}>({});
    const [showEducation,setShowEducation] = useState<boolean>(false);
    const [personal,setPersonal] = useState<boolean>(false);
    const [showPersonal,setShowPersonal] = useState<boolean>(false);
    const turnOffOthers = () => {
        setShowExperience(false);
        setShowEducation(false);
        setShowPersonal(false);
    };
    const getSearch=async()=>{
        console.log(194,{
            params:{
                search,
                budget,
                experience,
                education,
                personal
            }
        })
        const res = await api.get("/search/",{
            params:{
                search,
                budget,
                experience,
                education,
                personal
            }
        });
        setResults(res.data);
    };
    useEffect(()=>{
      alert(99)
        getSearch();
    },[search,budget,experience,education,personal]);
    return (
      <div>
        <div id="top">
            <input id="search" type="search" placeholder="What experience and skills are you looing for?"/>
                <div>
                    <span>Budget</span>
                    <MinMax values={budget} setValues={setBudget} min={0} max={100}/>
                </div>
                {showExperience&&<Experience/>}
                {showEducation&&<Education/>}
                {showPersonal&&<Personal/>}
                <button onClick={()=>{
                  let ogvalue = showExperience;
                  turnOffOthers();
                  setShowExperience(!ogvalue)
                  }}>
                    Experience Details
                </button>
                <button onClick={()=>{
                  let ogvalue = showEducation;
                  turnOffOthers();
                  setShowEducation(!ogvalue)
                  }}>Education Details</button>
                <button  onClick={()=>{
                  let ogvalue = showPersonal;
                  turnOffOthers();
                  setShowPersonal(!ogvalue)
                  }}>Personal Details</button>
                <button>Search</button>
        </div>
        <div id="results"></div>
      </div>
    );
};

export default Search;