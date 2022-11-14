import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';


const Max: React.FC<{value:number,setValue:Function,step:number,min:number, max: number }> = ({value,setValue,step,min,max }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
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
              display: 'flex',
              width: '100%',

            }}
          >
            <div
              ref={props.ref}
              style={{
                background: getTrackBackground({
                  values: [value],
                  colors: ['var(--primary-l2)', '#ccc'],
                  min: min,
                  max: max,
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
              ...props.style
            }}
            className="range-thumb"
          >
          </div>
        )}
      />
      <output className="output">
      <input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newval = e.target.value;
          alert(newval);
          if (newval === '') {
            setValue(min);
          } else {

            const val = Number(newval);
            if (val >=min && val <= max) {
              alert(1)
              setValue(val);
            }else if(max<=val){
              setValue(max);
            }else if(min>=val){
              setValue(min);
            }
          }
        }} type="number" />
      </output>
    </div>
  );
};

export default Max;
