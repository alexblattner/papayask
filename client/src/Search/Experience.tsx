import React, { useContext, useState, useEffect } from "react";
import MinMax from "./MinMax";
interface Props {
    setValues: Function;
    countries: string[] | Promise<string[]>;
  }
const Experience = (props:Props) => {
    const [type,setType] = useState<number|null>(null);
    const [experience,setExperience] = useState<[number,number]>([0,100]);
    const [geoExpertise,setGeoExpertise] = useState<string>("");
    const [companyRevenue,setCompanyRevenue] = useState<[number,number]>([0,100]);
    const [companyWorth,setCompanyWorth] = useState<[number,number]>([0,100]);
    const [companyAge,setCompanyAge] = useState<[number,number]>([0,100]);
    const [projectAmount,setProjectAmount] = useState<[number,number]>([0,100]);
    const [projectWorth,setProjectWorth] = useState<[number,number]>([0,100]);
    const [projectAverageRating,setProjectAverageRating] = useState<[number,number]>([0,100]);
    const [projectRatingAmount,setProjectRatingAmount] = useState<[number,number]>([0,100]);
    const [topBuyerWorth,setTopBuyerWorth] = useState<[number,number]>([0,100]);
    useEffect(()=>{
        props.setValues({
            type,
            experience,
            geoExpertise,
            companyRevenue,
            companyWorth,
            companyAge,
            projectAmount,
            projectWorth,
            projectAverageRating,
            projectRatingAmount,
            topBuyerWorth
        });
    },[type,experience,geoExpertise,companyRevenue,companyWorth,companyAge,projectAmount,projectWorth,projectAverageRating,projectRatingAmount,topBuyerWorth]);
    // useEffect(()=>{
    //     if (props.countries instanceof Promise) {
            
    //     } else {
    //         alert(props.countries[0]);
    //     }
    // },[props.countries]);
    return (
      <div className="filter-popup">
        <select onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setType(parseInt((e.target as HTMLSelectElement).value))}>
            <option disabled selected>Experience type</option>
            <option value="0">Any</option>
            <option value="1">Owner/Entrepeneurial</option>
            <option value="2">Freelance</option>
            <option value="3">Employment</option>
        </select>
        <div>{/*all */}
            <span>Geographic Specialization</span>
        </div>
        {false&&(type==1||type==3)&&
        <div>{/*owner/employee */}
            <span>Company</span>
            <input type="text" placeholder="Search for company"/>
            <input type="text" placeholder="Search for country of company"/>
            <div>{/*all */}
                <span>Yearly Revenue</span>
            </div>
            <div>
                <span>Net Worth</span>
            </div>
            <div>
                <span>Age of Company</span>
            </div>
            {/*<div>
                <span>Rating</span>
                <input type="text" placeholder="Min."/>
                <input type="text" placeholder="Max."/>
            </div>*/}
        </div>}
        {false&&(type==2)&&
        <>
        <div>{/*freelance */}
            <span>Number of Projects</span>
        </div>
        <div>{/*freelance */}
            <span>Average Project Worth($)</span>
        </div>
        <div>{/*freelance */}
            <span>Average Rating</span>
        </div>
        <div>{/*freelance */}
            <span>Number of Ratings</span>
        </div>
        <div>{/*freelance */}
            <span>Top Buyer's Net Worth</span>
        </div></>}
  </div>
    );
};

export default Experience;
