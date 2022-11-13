import React, { useContext, useState, useEffect } from "react";
import MinMax from "./MinMax";
const Personal = () => {
    const [netWorth,setNetWorth] = useState<[number,number]>([0,100]);
    const [yearlyRevenue,setYearlyRevenue] = useState<[number,number]>([0,100]);
    const [location,setLocation] = useState<string>("");
    const [language,setLanguage] = useState<string>("");
    const [connections,setConnections] = useState<[number,number]>([0,100]);
    return (
        <div className="filter-popup">
            <div>Personal</div>
            {false&&<><div>{/*all */}
                <span>Net Worth($)</span>
                <MinMax values={netWorth} setValues={setNetWorth} min={0} max={100}/>
            </div>
            <div>{/*all */}
                <span>Yearly Revenue($)</span>
                <MinMax values={yearlyRevenue} setValues={setYearlyRevenue} min={0} max={100}/>
            </div></>}
            {/*all */}
            <input type="text" value={location} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setLocation((e.target as HTMLInputElement).value)} placeholder="Search for country of residence"/>
            {/*all */}
            <input type="text" placeholder="Search for language"/>
            {false&&<><div>{/*all */}
                <span>Amount of connections</span>
                <MinMax values={connections} setValues={setConnections} min={0} max={100}/>
            </div></>}
        </div>
    );
};

export default Personal;