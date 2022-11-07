import React from 'react';

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepsDone: number[];
}

const ProfileSetupPagination = ({ step, stepsDone, setStep }: Props) => {
  const moveToStep = (step: number) => {
    if (step >= 0 && step <= 3 && stepsDone.includes(step)) {
      setStep(step);
    }
  };
  return (
    <div className="pagination">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <React.Fragment key={i}>
            <div
              className={`pagination-button  ${
                stepsDone.includes(i) ? 'done' : ''
              } ${step === i ? 'active' : ''} ${
                !stepsDone.includes(i) ? 'todo' : ''
              }`}
              onClick={() => moveToStep(i)}
            >
              {i + 1}
            </div>
            {i < 3 && <div className={`pagination-line `}></div>}
          </React.Fragment>
        ))}
    </div>
  );
};

export default ProfileSetupPagination;
