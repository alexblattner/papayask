import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import MinMax from "./MinMax";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import arrow from "./arrow.svg";
interface Props {
  setValues: Function;
  range: [number,number];
}
const YearsOfExperience = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    const [yearsOfExperience,setYearsOfExperience]=useState<[number,number]>(props.range);
    return (
        <div className="filter-popup">
          <button onClick={()=>setMenu(!menu)}>Years of Experience<img className={menu?"upside-down":""} src={arrow} /></button>
          {menu&&<MinMax values={yearsOfExperience} setValues={setYearsOfExperience} min={props.range[0]} step={1} max={props.range[1]}/>}
        </div>
    );
};

export default YearsOfExperience;