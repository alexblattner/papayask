import React, { useState, useEffect } from 'react';

import { AuthContext } from '../Auth/ContextProvider';
import Icon from '../shared/Icon';
import { socialName } from '../utils/socialName';
import { auth } from '../firebase-auth';
import { UserEducation, UserExperience, UserSkill } from '../models/User';
import ProfileSetupFooter from './ProfileSetupFooter';
import ProfileSetupPagination from './ProfileSetupPagination';
import SkillRow from './SkillRow';

interface ProfileSetupProps {
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'initial' | 'edit-all' | 'edit-one';
  initialStep?: number | null;
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
  setShowProfileSetup,
  type,
  initialStep,
}: ProfileSetupProps) => {
  const [title, setTitle] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { user, updateUser } = React.useContext(AuthContext);
  const [step, setStep] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [inputSkill, setInputSkill] = useState<UserSkill>({
    name: '',
    relatedEducation: [],
    relatedExperience: [],
  });
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [inputEducation, setInputEducation] = useState<Education>({
    school: '',
    fieldOfStudy: '',
    startYear: 0,
    endYear: 0,
  });
  const [experience, setExperience] = useState<UserExperience[]>([]);
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
    const newEducation: UserEducation = {
      school: inputEducation.school,
      fieldOfStudy: inputEducation.fieldOfStudy,
      years: `${inputEducation.startYear} - ${inputEducation.endYear}`,
    };
    setEducation([...education, newEducation]);
    setInputEducation({
      school: '',
      fieldOfStudy: '',
      startYear: 0,
      endYear: 0,
    });
  };

  const addExperience = () => {
    const newExperience: UserExperience = {
      company: inputExperience.company,
      position: inputExperience.position,
      years: `${inputExperience.startYear} - ${inputExperience.endYear}`,
    };
    setExperience([...experience, newExperience]);
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

  const submit = () => {
    updateUser(token, {
      isSetUp: true,
      title: title,
      bio: bio !== '' ? bio : undefined,
      skills: skills.length > 0 ? skills : undefined,
      education: education.length > 0 ? education : undefined,
      experience: experience.length > 0 ? experience : undefined,
      social: social.length > 0 ? social : undefined,
    });
    setShowProfileSetup(false);
  };

  useEffect(() => {
    auth.currentUser?.getIdToken().then((token) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setBio(user.bio);
      setSkills(user.skills);
      setEducation(user.education);
      setExperience(user.experience);
      setSocial(user.social);
      setTitle(user.title);
    }
  }, [user]);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (type !== 'initial') {
      setStepsDone([0, 1, 2, 3]);
    }
  }, [type]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <div className={`setup-modal ${pageLoaded ? 'modal-loaded' : ''}`}>
      <div className="setup-container">
        <ProfileSetupPagination
          setStep={setStep}
          step={step}
          stepsDone={stepsDone}
        />
        <div className="setup-content">
          {step === 0 && (
            <>
              <div className="step-title">Headline</div>
              <input
                className="setup-input"
                type="text"
                value={title}
                placeholder="Enter a link and press enter"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="step-title">Tell your clients about yourself</div>
              <textarea
                className="setup-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
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
                      <div className="years">{edu.years}</div>
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
                        <div className="years">{exp.years}</div>
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
              <div className="step-title">What skills do you have?</div>
              <input
                className="setup-input"
                type="text"
                value={inputSkill.name}
                placeholder="Type a skill and press enter"
                onChange={(e) =>
                  setInputSkill({ ...inputSkill, name: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSkills([...skills, inputSkill]);
                    setInputSkill({
                      name: '',
                      relatedEducation: [],
                      relatedExperience: [],
                    });
                  }
                }}
              />
              <div className="skills-container">
                <div className="skills-table-head">
                  <div className="skill-name">Skill</div>
                  <div className="related-education">Related Education</div>
                  <div className="related-experience">Related Experience</div>
                </div>
                {skills.map((skill, i) => (
                  <SkillRow
                    skill={skill}
                    key={i}
                    education={education}
                    experience={experience}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <ProfileSetupFooter
          step={step}
          submit={submit}
          setStep={setStep}
          stepsDone={stepsDone}
          setStepsDone={setStepsDone}
          token={token}
          setShowProfileSetup={setShowProfileSetup}
          type={type}
        />
      </div>
    </div>
  );
};

export default ProfileSetup;
