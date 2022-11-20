import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import MinMax from "./MinMax";
import api from "../utils/api";
import { UserProps } from "../models/User";
import arrow from "./arrow.svg";
import { useLocation } from "react-router-dom";
interface Props {
    data: UserProps;
}
const Result = (props:Props) => {
    const {search}=useLocation();
    const {data} = props;
    function escapeRegex(text:string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    const yearsOfExperience=()=>{
        const urlParams = new URLSearchParams(search);
        const searchParams = urlParams.get("search");
        const regex = new RegExp(escapeRegex(searchParams?searchParams:""), "gi");
        for(const experience of data.experience){//loop through all experiences
            if(regex.test(experience.name)){
                let startDate = new Date(experience.startDate);
                let endDate = new Date(experience.endDate?experience.endDate:Date.now());
                let diff = endDate.getTime() - startDate.getTime();
                let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                return years;
            }
        }
    }
    return (
        <div className="result">
            <div className="result-img">
                <img src={data.picture} />
            </div>
            <div className="result-info">
                <div className="result-name">
                    <h3>{data.name}</h3>
                </div>
                <div className="result-location">
                    <p>{data?.country}</p>
                </div>
                <div className="result-experience">
                    {yearsOfExperience()} years of experience
                </div>
                </div>
        </div>
    );
};

export default Result;