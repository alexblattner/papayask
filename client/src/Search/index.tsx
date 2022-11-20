import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./search.css";
import { UserProps,University,UserEducation } from "../models/User";
import Education from "./Education";
import Experience from "./Experience";
import YearsOfExperience from "./YearsOfExperience";
import MinMax from "./MinMax";
import Location from "./Location";
import Budget from "./Budget";
import Result from "./Result";
import api from "../utils/api";
interface EduProps {
    name:string;
    rank:number|null;
    degrees:string;
    university:string;
}
const Search = () => {
    const {search}=useLocation();
    const [allResults, setAllResults] = useState<UserProps[]>([]);
    const [results, setResults] = useState<UserProps[]>([]);
    const [budget,setBudget] = useState<[number,number]>([0,0]);
    const [yearsOfExperience,setYearsOfExperience] = useState<[number,number]>([0,0]);
    const [yearsOfExperienceRange,setYearsOfExperienceRange] = useState<[number,number]>([0,0]);
    const [education,setEducation] = useState<EduProps>({name:"",rank:null,degrees:"",university:""});
    const [allDegrees,setAllDegrees] = useState<string[]>([]);
    const [allUniversities,setAllUniversities] = useState<University[]>([]);
    const [allLocations,setAllLocations] = useState<string[]>([]);
    const [location,setLocation] = useState<string>("");
    function escapeRegex(text:string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const getSearch=async()=>{//initial search
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
        setAllResults(res.data);
        dataAdjustment(res.data);
    };
    const eduUnset=()=>{
        const edu=education;
        if(edu.degrees===""&&edu.university===""&&edu.name===""&&edu.rank===null){
            return true;
        }
        return false;  
    }
    const dataAdjustment=(users:UserProps[])=>{
        const urlParams = new URLSearchParams(search);
        const searchParams = urlParams.get("search");
        const regex = new RegExp(escapeRegex(searchParams?searchParams:""), "gi");
        let expmax=0;//maximun years of experience
        let expmin=1000;//minimum years of experience
        let degrees:Set<string>=new Set();//all degrees available for visible users
        let locations:string[]=[];//all locations available for visible users
        let universities:Set<University>=new Set();//all universities available for visible users
        let budgetsmax:number=0;//maximun budget
        let budgetsmin:number|null=null;//minimum budget
        let farr:UserProps[]=[]
        for(const result of users){//loop through all users
            let push:boolean=true;
            for(const experience of result.experience){//loop through all experiences
                if(regex.test(experience.name)){//if the experience name matches the search, we will count the years of experience
                    let startDate = new Date(experience.startDate);
                    let endDate = new Date(experience.endDate?experience.endDate:Date.now());
                    let diff = endDate.getTime() - startDate.getTime();
                    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                    if(!(yearsOfExperience[0]==0&&yearsOfExperience[1]==0)){//if the years of experience range is not set
                        if(years<yearsOfExperience[0]||years>yearsOfExperience[1]){//if the years of experience is not in the range, we will not push the user
                            push=false;
                        }
                    }else{
                        if(years>expmax){//if the years of experience is greater than the current max
                            expmax=years;//set the max to the years of experience for this experience
                        }
                        if(years<expmin){//if the years of experience is less than the current min
                            if(years==expmax)//if the years of experience is equal to the current max
                                expmin=years-1;//set the min to the years of experience for this experience minus 1
                            else
                            expmin=years;//set the min to the years of experience for this experience
                        }
                    }
                }
            }
            if(result.education.length>0){//if the user has education
                let edupush:boolean=false;
                for(const edu of result.education){//loop through all education
                    let fullname=edu.level+" in "+edu.name;//create the full name of the degree
                    if(!(education.name===""&&education.rank===null&&education.degrees===""&&education.university==="")){//if the education filter is not set
                        let eduNameReq=(education.name!=''&&education.name==fullname)||education.name=='';//if the education name is set and matches the full name or if the education name is not set
                        let eduRankReq=education.rank==null||education.rank>=edu.university.rank;//if the education rank is not set or if the education rank is set and is greater than or equal to the university rank
                        console.log(result.name,eduNameReq,eduRankReq);
                        if(eduNameReq&&eduRankReq){//if the education name and rank match the filter
                            edupush=true;//we will push the user
                        }
                    }else{
                        edupush=true;//we will push the user
                        degrees.add(fullname);//add the degree to the set of degrees
                        universities.add(edu.university);//add the university to the set of universities
                    }
                }
                if(!edupush)
                    push=false;
            }else if(!eduUnset()){//if the user does not have education and the education is not set to all
                push=false;//we will not push the user
            }
            if(location!=""){//if the location is set
                if(result.country!=location)//if the location does not match the filter
                    push=false;//we will not push the user
            }else{
                locations.push(result.country);//add the location to the set of locations
            }
            if(push)
            farr.push(result);
        }
        if(expmin==null){//if the min is still null
            expmin=0;
        }
        setAllDegrees(Array.from(degrees));
        let temp=Array.from(universities);
        setAllUniversities(temp);
        if(expmin<expmax)//if the min is less than the max
        setYearsOfExperienceRange([expmin,expmax]);
        if(yearsOfExperience[0]==0&&yearsOfExperience[1]==0)//if the years of experience range is not set
        setYearsOfExperience([expmin,expmax]);
        if(allLocations.length==0)//if the locations are not set
        setAllLocations(locations);
        setResults(farr);
    }
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
        if(allResults.length==0)
        getSearch();
    },[]);
    useEffect(()=>{
        dataAdjustment(allResults)
    },[search,budget,education,location,yearsOfExperience]);
    return (
      <div>
        <div id="top">
            {results.length>0&&<><YearsOfExperience values={yearsOfExperience} setValues={setYearsOfExperience} range={yearsOfExperienceRange}/>
            <Education values={education} universities={allUniversities} degrees={allDegrees} setValues={setEducation}/>
            <Location countries={allLocations} setValues={setLocation}/>
            <Budget setValues={setBudget} range={budget}/></>}
        </div>
        <div id="results">
            {results.map((result:UserProps)=><Result data={result}/>)}
        </div>
      </div>
    );
};

export default Search;