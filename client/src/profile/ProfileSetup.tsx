import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Icon from '../shared/Icon';
import { socialName } from '../utils/socialName';

interface ProfileSetupProps {
  showProfileSetup: boolean;
  setShowProfileSetup: (show: boolean) => void;
}

interface Education {
  school: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

interface Experience {
  company: string;
  position: string;
  startYear: number;
  endYear: number;
}

const ProfileSetup = ({
  showProfileSetup,
  setShowProfileSetup,
}: ProfileSetupProps) => {
  const [step, setStep] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState<string>('');
  const [education, setEducation] = useState<Education[]>([]);
  const [inputEducation, setInputEducation] = useState<Education>({
    school: '',
    fieldOfStudy: '',
    startYear: 0,
    endYear: 0,
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [inputExperience, setInputExperience] = useState<Experience>({
    company: '',
    position: '',
    startYear: 0,
    endYear: 0,
  });
  const [social, setSocial] = useState<string[]>([]);
  const [inputSocial, setInputSocial] = useState<string>('');

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const stepUp = () => {
    if (step < 2) {
      setStep(step + 1);
      setStepsDone([...stepsDone, step + 1]);
    }
  };

  const stepDown = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const moveToStep = (step: number) => {
    if (step >= 0 && step <= 2 && stepsDone.includes(step)) {
      setStep(step);
    }
  };

  const onChangeEducation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEducation({
      ...inputEducation,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeExperience = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputExperience({
      ...inputExperience,
      [event.target.name]: event.target.value,
    });
  };

  const addEducation = () => {
    setEducation([...education, inputEducation]);
    setInputEducation({
      school: '',
      fieldOfStudy: '',
      startYear: 0,
      endYear: 0,
    });
  };

  const addExperience = () => {
    setExperience([...experience, inputExperience]);
    setInputExperience({
      company: '',
      position: '',
      startYear: 0,
      endYear: 0,
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const removeExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const removeSocial = (index: number) => {
    const newSocial = [...social];
    newSocial.splice(index, 1);
    setSocial(newSocial);
  };

  const submit = () => {};

  return (
    <Modal show={showProfileSetup} dialogClassName="fullscreen-modal">
      <Modal.Body className="setup-container">
        <div className="pagination">
          {Array(3)
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
                {i < 2 && <div className={`pagination-line `}></div>}
              </React.Fragment>
            ))}
        </div>
        <div className="setup-content">
          {step === 0 && (
            <>
              <div className="step-title">Tell your clients about yourself</div>
              <textarea
                className="setup-textarea"
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
              <div className="step-title">What skills do you have?</div>
              <input
                className="setup-input"
                type="text"
                value={inputSkill}
                placeholder="Type a skill and press enter"
                onChange={(e) => setInputSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSkills([...skills, inputSkill]);
                    setInputSkill('');
                  }
                }}
              />
              <div className="skills-container">
                {skills.map((skill, i) => (
                  <div className="skill-badge" key={skill}>
                    {skill}
                    <div className="vertical-divider"></div>
                    <div
                      className="delete-skill"
                      onClick={() => removeSkill(i)}
                    >
                      <Icon src="close" width={12} height={12} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <div className="second-step-container">
              <div className="education-section">
                <div className="step-title">Education</div>
                <div className="education-form">
                  <input
                    className="setup-input"
                    type="text"
                    value={inputEducation.fieldOfStudy}
                    placeholder="field of study"
                    name="fieldOfStudy"
                    onChange={(e) => onChangeEducation(e)}
                  />
                  <input
                    className="setup-input"
                    type="text"
                    value={inputEducation.school}
                    placeholder="School"
                    name="school"
                    onChange={(e) => onChangeEducation(e)}
                  />

                  <div className="years-input-group">
                    <input
                      className="years-input"
                      type="number"
                      value={
                        inputEducation.startYear ? inputEducation.startYear : ''
                      }
                      placeholder="Start year"
                      name="startYear"
                      onChange={(e) => onChangeEducation(e)}
                    />
                    <input
                      className="years-input"
                      type="number"
                      value={
                        inputEducation.endYear ? inputEducation.endYear : ''
                      }
                      placeholder="End year"
                      name="endYear"
                      onChange={(e) => onChangeEducation(e)}
                    />
                  </div>
                  <button className="add-button" onClick={addEducation}>
                    Add
                  </button>
                </div>
                <div className="education-list">
                  {education.map((edu, i) => (
                    <div key={i} className="education-box">
                      <div className="field-of-study">{edu.fieldOfStudy}</div>
                      <div className="school">{edu.school}</div>
                      <div className="years">
                        {edu.startYear} - {edu.endYear ? edu.endYear : 'Now'}
                      </div>
                      <div
                        onClick={() => removeEducation(i)}
                        className="remove-button"
                      >
                        <Icon src="close" width={20} height={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="experience-section">
                <div className="step-title">Experience</div>
                <div className="experience-form">
                  <input
                    className="setup-input"
                    type="text"
                    value={inputExperience.position}
                    placeholder="Position"
                    name="position"
                    onChange={(e) => onChangeExperience(e)}
                  />
                  <input
                    className="setup-input"
                    type="text"
                    value={inputExperience.company}
                    placeholder="Company"
                    name="company"
                    onChange={(e) => onChangeExperience(e)}
                  />

                  <div className="years-input-group">
                    <input
                      className="years-input"
                      type="number"
                      value={
                        inputExperience.startYear
                          ? inputExperience.startYear
                          : ''
                      }
                      placeholder="Start year"
                      name="startYear"
                      onChange={(e) => onChangeExperience(e)}
                    />
                    <input
                      className="years-input"
                      type="number"
                      value={
                        inputExperience.endYear ? inputExperience.endYear : ''
                      }
                      placeholder="End year"
                      name="endYear"
                      onChange={(e) => onChangeExperience(e)}
                    />
                  </div>
                  <button className="add-button" onClick={addExperience}>
                    Add
                  </button>
                  <div className="experience-list">
                    {experience.map((exp, i) => (
                      <div key={i} className="experience-box">
                        <div className="position">{exp.position}</div>
                        <div className="company">{exp.company}</div>
                        <div className="years">
                          {exp.startYear} - {exp.endYear ? exp.endYear : 'Now'}
                        </div>
                        <div
                          onClick={() => removeExperience(i)}
                          className="remove-button"
                        >
                          <Icon src="close" width={20} height={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="third-step-container">
              <div className="step-title">Add your social links</div>
              <input
                className="setup-input"
                type="text"
                value={inputSocial}
                placeholder="Enter a link and press enter"
                onChange={(e) => setInputSocial(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSocial([...social, inputSocial]);
                    setInputSocial('');
                  }
                }}
              />
              <div className="social-list">
                {social.map((social, i) => (
                  <div className="social-container" key={social}>
                    <Icon src={socialName(social)} width={32} height={32} />
                    <div
                      className="delete-social"
                      onClick={() => removeSocial(i)}
                    >
                      <Icon src="close" width={12} height={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="setup-footer">
          <button className="footer-button skip">Skip</button>
          <button
            className="footer-button"
            disabled={step === 0}
            onClick={stepDown}
          >
            Back
          </button>
          {step !== 2 && (
            <button
              className="footer-button"
              disabled={step === 2}
              onClick={stepUp}
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button className="footer-button" onClick={submit}>
              Submit
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileSetup;
