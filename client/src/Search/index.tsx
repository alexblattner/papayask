import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./search.css";
import Education from "./Education";
import Experience from "./Experience";
import YearsOfExperience from "./YearsOfExperience";
import MinMax from "./MinMax";
import Location from "./Location";
import Budget from "./Budget";
import Result from "./Result";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import { UserProps } from "../models/User";
const Search = () => {
    const {search}=useLocation();
    const [Allresults, setAllResults] = useState<UserProps[]>([]);
    const [results, setResults] = useState<UserProps[]>([]);
    const [budget,setBudget] = useState<[number,number]>([0,0]);
    const [yearsOfExperience,setYearsOfExperience] = useState<[number,number]>([0,15]);
    const [yearsOfExperienceRange,setYearsOfExperienceRange] = useState<[number,number]>([0,0]);
    const [education,setEducation] = useState<{}>({});
    const [allDegrees,setAllDegrees] = useState<string[]>([]);
    const [allUniversities,setAllUniversities] = useState<UniversityProps[]>([]);
    const [location,setLocation] = useState<{}>({});
    function escapeRegex(text:string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const getSearch=async()=>{
        const urlParams = new URLSearchParams(search);
        const searchParams = urlParams.get("search");
        const res = await api.get("/search/",{
            params:{
                search:searchParams,
                budget,
                education,
                location
            }
        });
        setResults(res.data);
        setAllResults(res.data);
        const regex = new RegExp(escapeRegex(searchParams?searchParams:""), "gi");
        let expmax=0;
        let expmin=null;
        let degrees:Set<string>=new Set();
        let locations:string[]=[];
        let universities:Set<UniversityProps>=new Set();
        let budgetsmax:number=0;
        let budgetsmin:number|null=null;
        console.log(999,res.data);
        for(const result of res.data){
            for(const experience of result.experience){
                if(regex.test(experience.name)){
                    console.log(1932,experience);
                    let startDate = new Date(experience.startDate);
                    let endDate = new Date(experience.endDate?experience.endDate:Date.now());
                    let diff = endDate.getTime() - startDate.getTime();
                    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                    if(years>expmax){
                        expmax=years;
                    }
                    if(expmin==null||years<expmin){
                        if(years==expmax)
                            expmin=years-1;
                        else
                        expmin=years;
                    }
                }
            }
            if(result.education.length>0){
                for(const education of result.education){
                    let fullname=education.level+" in "+education.degree;
                    degrees.add(fullname);
                    universities.add(education.university);
                }
            }
            
        }
        if(expmin==null){
            expmin=0;
        }
        setAllDegrees(Array.from(degrees));
        let temp=Array.from(universities);
        setAllUniversities(temp);
        setYearsOfExperienceRange([expmin,expmax]);
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
        alert(9)
    },[search,budget,education,location]);
    return (
      <div>
        <div id="top">
            {results.length>0&&<><YearsOfExperience setValues={setYearsOfExperience} range={yearsOfExperienceRange}/>
            {allDegrees.length>0&&<Education values={education} universities={allUniversities} degrees={allDegrees} setValues={setEducation}/>}
            <Location setValues={setLocation}/>
            <Budget setValues={setBudget} range={budget}/></>}
        </div>
        <div id="results">
            {results.map((result:UserProps)=><Result data={result}/>)}
        </div>
      </div>
    );
};

export default Search;