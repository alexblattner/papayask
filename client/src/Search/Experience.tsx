import React, { useContext, useState, useEffect } from "react";
import MinMax from "./MinMax";
interface Props {
    setValues: Function;
    countries: string[] | Promise<string[]>;
  }
const Experience = (props:Props) => {
    const [type,setType] = useState<number|null>(null);
    const [experience,setExperience] = useState<[number,number]>([0,100]);
    const [geoExpertise,setGeoExpertise] = useState<string | number | readonly string[] | undefined>("");
    const [companyRevenue,setCompanyRevenue] = useState<[number,number]>([0,100]);
    const [companyWorth,setCompanyWorth] = useState<[number,number]>([0,100]);
    const [companyAge,setCompanyAge] = useState<[number,number]>([0,100]);
    const [projectAmount,setProjectAmount] = useState<[number,number]>([0,100]);
    const [projectWorth,setProjectWorth] = useState<[number,number]>([0,100]);
    const [projectAverageRating,setProjectAverageRating] = useState<[number,number]>([0,100]);
    const [projectRatingAmount,setProjectRatingAmount] = useState<[number,number]>([0,100]);
    const [topBuyerWorth,setTopBuyerWorth] = useState<[number,number]>([0,100]);
    return (
      <div className="filter-popup">
        <div>{/*all */}
            <span>Years of Experience</span>
            <MinMax values={experience} setValues={setExperience} min={0} max={100}/>
        </div>
        <select onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setType(parseInt((e.target as HTMLSelectElement).value))}>
            <option disabled selected>Experience type</option>
            <option value="0">Any</option>
            <option value="1">Owner/Entrepeneurial</option>
            <option value="2">Freelance</option>
            <option value="3">Employment</option>
        </select>
        <div>{/*all */}
            <span>Geographic Specialization</span>
            <input type="text" value={geoExpertise} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setGeoExpertise((e.target as HTMLInputElement).value)} placeholder="Country"/>
        </div>
        {false&&(type==1||type==3)&&
        <div>{/*owner/employee */}
            <span>Company</span>
            <input type="text" placeholder="Search for company"/>
            <input type="text" placeholder="Search for country of company"/>
            <div>{/*all */}
                <span>Yearly Revenue</span>
                <MinMax values={companyRevenue} setValues={setCompanyRevenue} min={0} max={100}/>
            </div>
            <div>
                <span>Net Worth</span>
                <MinMax values={companyWorth} setValues={setCompanyWorth} min={0} max={100}/>
            </div>
            <div>
                <span>Age of Company</span>
                <MinMax values={companyAge} setValues={setCompanyAge} min={0} max={100}/>
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
            <MinMax values={projectAmount} setValues={setProjectAmount} min={0} max={100}/>
        </div>
        <div>{/*freelance */}
            <span>Average Project Worth($)</span>
            <MinMax values={projectWorth} setValues={setProjectWorth} min={0} max={100}/>
        </div>
        <div>{/*freelance */}
            <span>Average Rating</span>
            <MinMax values={projectAverageRating} setValues={setProjectAverageRating} min={0} max={100}/>
        </div>
        <div>{/*freelance */}
            <span>Number of Ratings</span>
            <MinMax values={projectRatingAmount} setValues={setProjectRatingAmount} min={0} max={100}/>
        </div>
        <div>{/*freelance */}
            <span>Top Buyer's Net Worth</span>
            <MinMax values={topBuyerWorth} setValues={setTopBuyerWorth} min={0} max={100}/>
        </div></>}
  </div>
    );
};

export default Experience;
