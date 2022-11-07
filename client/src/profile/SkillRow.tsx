import React from 'react';
import {
  RelatedEducation,
  RelatedExperience,
  UserEducation,
  UserExperience,
  UserSkill,
} from '../models/User';
import Icon from '../shared/Icon';

interface Props {
  skill: UserSkill;
  education: UserEducation[];
  experience: UserExperience[];
}

const SkillRow = ({ skill, education, experience }: Props) => {
  const [relatedEducation, setRelatedEducation] = React.useState<
    RelatedEducation[]
  >([]);
  const [relatedExperience, setRelatedExperience] = React.useState<
    RelatedExperience[]
  >([]);
  const [showRelated, setShowRelated] = React.useState(false);
  const [educationIndexSelected, setEducationIndexSelected] = React.useState<
    number[]
  >([]);
  const [experienceIndexSelected, setexperienceIndexSelected] = React.useState<
    number[]
  >([]);

  const selectEducation = (index: number) => {
    if (educationIndexSelected.includes(index)) {
      setEducationIndexSelected(
        educationIndexSelected.filter((i) => i !== index)
      );
    } else {
      setEducationIndexSelected([...educationIndexSelected, index]);
    }
  };

  const selectExperience = (index: number) => {
    if (experienceIndexSelected.includes(index)) {
      setexperienceIndexSelected(
        experienceIndexSelected.filter((i) => i !== index)
      );
    } else {
      setexperienceIndexSelected([...experienceIndexSelected, index]);
    }
  };

  const numberOfYears = (field: UserEducation | UserExperience): number => {
    const start = field.years.split('-')[0];
    const end =
      field.years.split('-')[1].trim() !== 'Present'
        ? field.years.split('-')[1]
        : new Date().getFullYear().toString();
    const diff = parseInt(end) - parseInt(start);
    return diff;
  };

  return (
    <>
      <div className="skill-row" key={skill.name}>
        <div className="skill-name">{skill.name}</div>
        <div className="related-education"></div>
        <div className="related-experience"></div>
        <div className="plus-icon" onClick={() => setShowRelated(true)}>
          {' '}
          <Icon src="plus" width={15} height={15} />
        </div>
      </div>
      {showRelated && (
        <>
          <p>Related Education:</p>
          <div className="education-list">
            {education.map((edu, i) => (
              <div key={i} className="education-box">
                <div className="field-of-study">{edu.fieldOfStudy}</div>
                <div className="school">{edu.school}</div>
                <div className="years">
                  <input placeholder="Years" />
                </div>
                <div
                  className={`check-button ${
                    educationIndexSelected.includes(i) ? 'selected' : ''
                  }`}
                  onClick={() => selectEducation(i)}
                ></div>
              </div>
            ))}
          </div>
        </>
      )}
      {showRelated && (
        <>
          <p>Related Experience:</p>
          <div className="experience-list">
            {experience.map((exp, i) => (
              <div key={i} className="experience-box">
                <div className="position">{exp.position}</div>
                <div className="company">{exp.company}</div>
                <div className="years">
                  <input placeholder="Years" />
                </div>
                <div
                  className={`check-button ${
                    experienceIndexSelected.includes(i) ? 'selected' : ''
                  }`}
                  onClick={() => selectExperience(i)}
                >
                  {' '}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SkillRow;
