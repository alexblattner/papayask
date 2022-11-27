import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import MinMax from "./MinMax";
import api from "../utils/api";
import { UniversityProps } from "../models/University";
import arrow from "./arrow.svg";
interface Props {
  setValues: Function;
  range: [number, number];
}
const Budget = (props: Props) => {
  const [menu, setMenu] = useState<boolean>(false);
  const [budget, setBudget] = useState<[number, number]>(props.range);
  return (
    <div className="filter-popup">
      <button onClick={() => setMenu(!menu)}>
        Budget
        <img className={menu ? "upside-down" : ""} src={arrow} />
      </button>
      {menu && (
        <MinMax
          values={budget}
          setValues={setBudget}
          min={props.range[0]}
          step={1}
          max={props.range[1]}
        />
      )}
    </div>
  );
};

export default Budget;
