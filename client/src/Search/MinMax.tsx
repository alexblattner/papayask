import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';
import { NumericLiteral } from 'typescript';


const MinMax: React.FC<{values:[number,number],setValues:Function, min: number,max: number, step:number }> = ({values,setValues, min,max,step }) => {
  return (
    <div
      className="range-holder"
    >
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        rtl={false}
        onChange={(values) => {
          setValues(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', 'var(--primary-l2)', '#ccc'],
                  min: min,
                  max: max,
                  rtl:false
                }),
              }}
              className="range"
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
            }}
            className="range-thumb"
          >
          </div>
        )}
      />
      <output className="output">
        <input className='left' value={values[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (value === '') {
            setValues([min, values[1]]);
          } else {
            const val = Number(value);
            if (val >= min && val < values[1]) {
              setValues([val, values[1]]);
            }else if(val>=values[1]){
              setValues([values[1]-step,values[1]]);
            }
          }
        }} type="number" />
        <input className='right' value={values[1]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          if (value === '') {
            setValues([values[0], max]);
          } else {
            const val = parseInt(value);
            if (val > values[0] && val <= max) {
              setValues([values[0], val]);
            }else if(val<=values[0]){
              setValues([values[0],values[0]+step]);
            }
          }
        }} type="number" />
      </output>
    </div>
  );
};

export default MinMax;
