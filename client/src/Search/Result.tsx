import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import MinMax from "./MinMax";
import api from "../utils/api";
import { UserProps } from "../models/User";
import arrow from "./arrow.svg";
interface Props {
    data: UserProps;
}
const Result = (props:Props) => {
    const {data} = props;
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
                <div className="result-connections">
                    <p>{data.connections?data.connections.length:0  } connections</p>
                </div>
            </div>
        </div>
    );
};

export default Result;