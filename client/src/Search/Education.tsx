import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Max from "./Max";
const Education = () => {
    const [rank,setRank]=useState<number>(100);
    const [school,setSchool]=useState<string>("");
    const [degree,setDegree]=useState<string>("");
    const [results,setResults]=useState<string[]>([]);
    return (
      <div  className="filter-popup">
        <div>Education</div>
        <div>
          <span>Education Level</span>
          <select>
            <option value="any">Any</option>
            <option value="certificated">Course and above</option>
            <option value="bachelors">Bachelors and above</option>
            <option value="masters">Masters and above</option>
            <option value="phd">PhD</option>
          </select>
        </div>
        <div>
          <span>Degree</span>
          <input type="text" placeholder="Search for subject expert studied"/>
        </div>
        <div>
          <span>University</span>
          <div>
            <input type="text" placeholder="Search for university expert studied at"/>
            {results.map((result:string)=><div>{result}</div>)}
          </div>
        </div>
        <div>
          <span>University Rank</span>
          <Max value={rank} setValue={setRank} min={1} step={1} max={100}/>
        </div>
      </div>
    );
};

export default Education;