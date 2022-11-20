import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import MinMax from "./MinMax";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import arrow from "./arrow.svg";
interface Props {
  values: [number, number];
  setValues: Function;
  range: [number,number];
}
const YearsOfExperience = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    return (
        <div className="filter-popup">
          <button onClick={()=>setMenu(!menu)}>Years of Experience<img className={menu?"upside-down":""} src={arrow} /></button>
          {menu&&<MinMax values={props.values} setValues={props.setValues} min={props.range[0]} step={1} max={props.range[1]}/>}
        </div>
    );
};

export default YearsOfExperience;