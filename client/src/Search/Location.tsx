import React, { useContext, useState, useEffect } from "react";
import MinMax from "./MinMax";
import countries from "../shared/countries";
import arrow from "./arrow.svg";

interface Props {
    setValues: Function;
}

const Location = (props:Props) => {
    const country_names = countries.map((country:any)=>country.name)
    const [menu,setMenu]=useState<boolean>(false);
    const [netWorth,setNetWorth] = useState<[number,number]>([0,100]);
    const [yearlyRevenue,setYearlyRevenue] = useState<[number,number]>([0,100]);
    const [location,setLocation] = useState<string>("");
    const [language,setLanguage] = useState<string>("");
    const [connections,setConnections] = useState<[number,number]>([0,100]);
    return (
        <div className="filter-popup">
            <button onClick={()=>setMenu(!menu)}>Location<img className={menu?"upside-down":""} src={arrow} /></button>
            {menu&&<>
            {false&&<><div>{/*all */}
                <span>Net Worth($)</span>
            </div>
            <div>{/*all */}
                <span>Yearly Revenue($)</span>
            </div></>}
            {/*all */}
            <input type="text" value={location} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setLocation((e.target as HTMLInputElement).value)} placeholder="Search for country of residence"/>
            {/*all */}
            <input type="text" placeholder="Search for language"/>
            {false&&<><div>{/*all */}
                <span>Amount of connections</span>
            </div></>}</>}
        </div>
    );
};

export default Location;