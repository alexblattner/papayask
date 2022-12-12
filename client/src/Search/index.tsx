import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./search.css";
import { UserProps, University, UserEducation } from "../models/User";
import Education from "./Education";
import Experience from "./Experience";
import YearsOfExperience from "./YearsOfExperience";
import MinMax from "./MinMax";
import Location from "./Location";
import Budget from "./Budget";
import Result from "./Result";
import api from "../utils/api";
interface EduProps {
  name: string;
  rank: number | null;
  degree: string;
  university: string;
}
const Search = () => {
  const { search } = useLocation();
  const { query } = useParams();
  const [allResults, setAllResults] = useState<UserProps[]>([]);
  const [results, setResults] = useState<UserProps[]>([]);
  const [budget, setBudget] = useState<[number, number]>([0, 1]);
  const [yearsOfExperience, setYearsOfExperience] = useState<[number, number]>([
    0, 0,
  ]);
  const [yearsOfExperienceRange, setYearsOfExperienceRange] = useState<
    [number, number]
  >([0, 0]);
  const [education, setEducation] = useState<EduProps>({
    name: "",
    rank: null,
    degree: "",
    university: "",
  });
  const [allDegrees, setAllDegrees] = useState<string[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    country: string;
    language: string;
  }>({ country: "", language: "" });
  function escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  const getSearch = async () => {
    //initial search
    const urlParams = new URLSearchParams(search);

    const searchParams = urlParams.get("query");
    console.log(678, searchParams);
    const res = await api.get("/search/", {
      params: {
        search: query,
        budget,
        education,
        location,
      },
    });
    setAllResults(res.data);
    dataAdjustment(res.data);
  };
  const eduUnset = () => {
    const edu = education;
    if (
      edu.degree === "" &&
      edu.university === "" &&
      edu.name === "" &&
      edu.rank === null
    ) {
      return true;
    }
    return false;
  };
  const dataAdjustment = (users: UserProps[]) => {
    const urlParams = new URLSearchParams(search);
    // const searchParams = urlParams.get("search");
    const regex = new RegExp(escapeRegex(query ? query : ""), "gi");
    let expmax = 0; //maximun years of experience
    let expmin = 1000; //minimum years of experience
    let degrees: Set<string> = new Set(); //all degrees available for visible users
    let locations: Set<string> = new Set(); //all locations available for visible users
    let languages: Set<string> = new Set(); //all languages available for visible users
    let universities: Set<University> = new Set(); //all universities available for visible users
    let budgetsmax: number = 0; //maximun budget
    let budgetsmin: number | null = null; //minimum budget
    let farr: UserProps[] = [];
    for (const result of users) {
      //loop through all users
      let push: boolean = true;
      let maxexp = 0; //maximun years of experience for this user
      let minexp = 1000; //minimum years of experience for this user
      for (const experience of result.experience) {
        //loop through all experiences
        if (regex.test(experience.name)) {
          //if the experience name matches the search, we will count the years of experience
          let startDate = new Date(experience.startDate);
          let endDate = new Date(
            experience.endDate ? experience.endDate : Date.now()
          );
          let diff = endDate.getTime() - startDate.getTime();
          let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
          if (years > maxexp) {
            maxexp = years;
          }
          if (years < minexp) {
            minexp = years;
          }
        }
      }
      if (!(yearsOfExperience[0] == 0 && yearsOfExperience[1] == 0)) {
        //if the years of experience range is not set
        console.log("adjust", minexp, maxexp);
        console.log("adjust1", yearsOfExperience, result.name);
        if (maxexp < yearsOfExperience[0] || minexp > yearsOfExperience[1]) {
          //if the years of experience is not in the range, we will not push the user
          push = false;
        }
      } else {
        //sets the range of experience
        console.log("setting range", minexp, maxexp);
        if (maxexp > expmax) {
          //if the years of experience is greater than the current max
          expmax = maxexp; //set the max to the years of experience for this experience
        }
        if (minexp < expmin) {
          //if the years of experience is less than the current min
          if (minexp == expmax)
            //if the years of experience is equal to the current max
            expmin = minexp - 1;
          //set the min to the years of experience for this experience minus 1
          else expmin = minexp; //set the min to the years of experience for this experience
        }
      }
      if (!result.request_settings || !result.request_settings.cost) {
        console.log(1212, result.request_settings);
        push = false;
      } else if (
        !(budget[0] == 0 && budget[1] == 1) &&
        (result.request_settings.cost > budget[1] ||
          result.request_settings.cost < budget[0])
      ) {
        console.log(1212, result.request_settings.cost, budget[1], budget[0]);
        push = false;
      }
      if (result.education.length > 0) {
        //if the user has education
        let edupush: boolean = false;
        for (const edu of result.education) {
          //loop through all education
          let fullname = edu.level + " in " + edu.name; //create the full name of the degree
          if (
            !(
              education.name === "" &&
              education.rank === null &&
              education.degree === "" &&
              education.university === ""
            )
          ) {
            //if the education filter is not set
            let eduNameReq =
              (education.name != "" && education.name == fullname) ||
              education.name == ""; //if the education name is set and matches the full name or if the education name is not set
            let eduRankReq =
              education.rank == null || education.rank >= edu.university.rank; //if the education rank is not set or if the education rank is set and is greater than or equal to the university rank
            console.log(result.name, eduNameReq, eduRankReq);
            if (eduNameReq && eduRankReq) {
              //if the education name and rank match the filter
              edupush = true; //we will push the user
            }
          } else {
            edupush = true; //we will push the user
            degrees.add(fullname); //add the degree to the set of degrees
            universities.add(edu.university); //add the university to the set of universities
          }
        }
        if (!edupush) push = false;
      } else if (!eduUnset()) {
        //if the user does not have education and the education is not set to all
        push = false; //we will not push the user
      }
      if (location.country != "" || location.language != "") {
        //if the location is set
        let cond1 = !(
          location.country == "" ||
          (location.country != "" && result.country == location.country)
        ); //if the country is not set or if the country is set and the user's country matches the country
        let cond2 = !(
          location.language == "" ||
          (location.language != "" &&
            result.languages.includes(location.language))
        ); //if the language is not set or if the language is set and the user's languages includes the language
        if (cond1)
          //if the country is not set or if the country is set and matches the user's country
          push = false; //we will not push the user
        if (cond2)
          //if the language is not set or if the language is set and matches the user's language
          push = false; //we will not push the user
      } else {
        locations.add(result.country); //add the location to the set of locations
        for (const lang of result.languages) {
          //loop through all languages
          languages.add(lang); //add the language to the set of languages
        }
      }
      if (push) farr.push(result);
    }
    if (expmin == null) {
      //if the min is still null
      expmin = 0;
    }
    setAllDegrees(Array.from(degrees));
    let temp = Array.from(universities);
    console.log(99999, temp);
    if (temp.length > 0) setAllUniversities(temp);
    if (expmin < expmax)
      //if the min is less than the max
      setYearsOfExperienceRange([expmin, expmax]);
    if (yearsOfExperience[0] == 0 && yearsOfExperience[1] == 0)
      //if the years of experience range is not set
      setYearsOfExperience([expmin, expmax]);
    if (allCountries.length == 0)
      //if the locations are not set
      setAllCountries(Array.from(locations));
    if (allLanguages.length == 0)
      //if the languages are not set
      setAllLanguages(Array.from(languages));
    console.log(1234567, farr);
    setResults(farr);
  };

  useEffect(() => {
    if (allResults.length > 1) {
      let min = allResults[0].request_settings.cost;
      let max = allResults[0].request_settings.cost;
      allResults.forEach((result) => {
        if (result.request_settings) {
          if (result.request_settings?.cost > max) {
            max = result.request_settings.cost;
          } else if (result.request_settings?.cost < min) {
            min = result.request_settings.cost;
          }
        }
        if (min == max) {
          min--;
        }
      });
      setBudget([min, max]);
    }
  }, [allResults]);
  const expRange = () => {
    // for(let i=0;i<results.length;i++){
    //     if(results[i].experience){
    //         return [0,results[i].experience.length];
    //     }
    // }
    // const min = results.reduce((a,b)=>Math.min(a,b.yearsOfExperience),Infinity);
    // const max = results.reduce((a,b)=>Math.max(a,b.yearsOfExperience),-Infinity);
    // return [min,max];
  };
  useEffect(() => {
    if (allResults.length == 0) getSearch();
  }, []);
  useEffect(() => {
    dataAdjustment(allResults);
  }, [search, budget, education, location, yearsOfExperience]);

  console.log(1212, results);
  return (
    <div>
      <div id="top">
        <YearsOfExperience
          values={yearsOfExperience}
          setValues={setYearsOfExperience}
          range={yearsOfExperienceRange}
        />
        {allUniversities.length != 0 && (
          <Education
            values={education}
            universities={allUniversities}
            degrees={allDegrees}
            setValues={setEducation}
          />
        )}
        <Location
          countries={allCountries}
          values={location}
          languages={allLanguages}
          setValues={setLocation}
        />
        <Budget setValues={setBudget} range={budget} />
      </div>
      <div id="results">
        {allResults.map((result: UserProps) => (
          <Result data={result} />
        ))}
      </div>
    </div>
  );
};

export default Search;
