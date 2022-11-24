import React, { useContext, useState, useEffect } from "react";
import MinMax from "./MinMax";
import CountriesSelect from "../shared/CountriesSelect";
import LanguagesSelect from "../shared/LanguagesSelect";
import arrow from "./arrow.svg";

interface Props {
    values:{country:string, language:string};
    setValues: Function;
    countries: string[];
    languages: string[];
}

const Location = (props:Props) => {
    const [menu,setMenu]=useState<boolean>(false);
    const [netWorth,setNetWorth] = useState<[number,number]>([0,100]);
    const [yearlyRevenue,setYearlyRevenue] = useState<[number,number]>([0,100]);
    const [location,setLocation] = useState<string>("");
    const [language,setLanguage] = useState<string>("");
    const [connections,setConnections] = useState<[number,number]>([0,100]);
    const countrySelected=(value:string)=>{
        let ob=props.values;
        ob["country"]=value;
        props.setValues({...ob});
    }
    useEffect(()=>{
        if(location===""){
            let ob=props.values;
            ob["country"]='';
            props.setValues({...ob});
        }
    },[location])
    useEffect(()=>{
        if(language===""){
            let ob=props.values;
            ob["language"]='';
            console.log(3939,ob);
            
            props.setValues(ob);
        }
    },[language])
    const languageBlurred=(value:string)=>{
        if(value===""){
            let ob=props.values;
            ob["language"]='';
            props.setValues({...ob});
        }
    }
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
            <CountriesSelect adder={countrySelected} value={location} options={props.countries} onChange={setLocation} inputName=""/>
            {/*all */}
            <LanguagesSelect onBlur={languageBlurred    } allLanguages={props.languages} addLanguage={(l:string)=>{
                let ob=props.values;
                ob["language"]=l;
                props.setValues(ob);
            }}/>
            {false&&<><div>{/*all */}
                <span>Amount of connections</span>
            </div></>}</>}
        </div>
    );
};

export default Location;