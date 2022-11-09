import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Max from "./Max";
const Education = () => {
    const [rank,setRank]=useState<number>(100);
    useEffect(()=>{
      alert(1)
      axios.get("https://www.timeshighereducation.com/world-university-rankings/2023/world-ranking#!/page/0/length/-1/sort_by/rank/sort_order/asc/cols/scores",{headers: {"Access-Control-Allow-Origin": "*"}}).then((res)=>{
        alert(333)  
        const html = res.data.split('.js-row');
        alert(html[0])  

      });
    },[]);
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
          <span>Subject</span>
          <input type="text" placeholder="Search for subject expert studied"/>
        </div>
        <div>
          <span>University</span>
          <input type="text" placeholder="Search for university expert studied at"/>
        </div>
        <div>
          <span>University Rank</span>
          <Max value={rank} setValue={setRank} min={1} step={1} max={100}/>
        </div>
      </div>
    );
};

export default Education;