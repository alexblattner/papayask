import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';
import { NumericLiteral } from 'typescript';

const STEP = 0.1;

const MinMax: React.FC<{values:[number,number],setValues:Function, min: number,max: number }> = ({values,setValues, min,max }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Range
        values={values}
        step={STEP}
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
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: min,
                  max: max,
                  rtl:false
                }),
                alignSelf: 'center'
              }}
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
              height: '20px',
              width: '10px',
              borderRadius: '4px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA'
            }}
          >
          </div>
        )}
      />
      <output className="output">
        {values[0].toFixed(1)} - {values[1].toFixed(1)}
      </output>
    </div>
  );
};

export default MinMax;
