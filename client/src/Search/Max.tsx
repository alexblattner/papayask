import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';


const Max: React.FC<{value:number,setValue:Function,step:number,min:number, max: number }> = ({value,setValue,step,min,max }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Range
        values={[value]}
        step={step}
        min={min}
        max={max}
        rtl={false}
        onChange={(values) => {
          setValue(values[0]);
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
                  values: [value],
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
        {value.toFixed(1)}
      </output>
    </div>
  );
};

export default Max;
