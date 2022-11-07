import React from 'react';
import { AuthContext } from '../Auth/ContextProvider';
import Icon from '../shared/Icon';

import './profile.css';
import ProfileSetup from './ProfileSetup';

const Profile = () => {
  const [isOwner, setIsOwner] = React.useState<boolean>(true);
  const [editType, setEditType] = React.useState<
    'initial' | 'edit-all' | 'edit-one'
  >('edit-all');
  const [initialSetupStep, setInitialSetupStep] = React.useState<number | null>(
    null
  );
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const { user } = React.useContext(AuthContext);

  const openProfileSetup = () => {
    setEditType('edit-all');
    setShowProfileSetup(true);
  };

  const openProfileSetupInStep = (step: number) => {
    setEditType('edit-one');
    setInitialSetupStep(step);
    setShowProfileSetup(true);
  };

  if (!user) return null;
  return (
    <section className="profile-page">
      {showProfileSetup && (
        <ProfileSetup
          setShowProfileSetup={setShowProfileSetup}
          type={editType}
          initialStep={initialSetupStep}
        />
      )}
      <div className="cover-img-container">
        <img
          className="cover-img"
          src={user.picture ?? 'https://source.unsplash.com/random'}
          alt="cover-img"
        />
      </div>
      <div className="profile-img-container">
        <img
          className="profile-img"
          src={
            user.coverPicture ?? 'https://source.unsplash.com/random/2000x500'
          }
          alt="profile-img"
        />
      </div>
      <div className="profile-info">
        <div className="info-head">
          <div className="user-rating">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Icon src="Star_Fill" width={30} height={30} key={i} />
              ))}
            <p className="rating-number">(12)</p>
          </div>
          <div className="actoins">
            {isOwner ? (
              <button className="edit-profile" onClick={openProfileSetup}>
                {' '}
                <Icon src="Edit_White" width={20} height={20} /> EDIT
              </button>
            ) : (
              <div className="actions-buttons-group">
                <button>
                  <Icon src="Send" width={25} height={25} />
                </button>
                <button>
                  <Icon src="Share" width={25} height={25} />
                </button>
                <button>
                  <Icon src="Heart" width={25} height={25} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="name">{user.name}</div>
        <div className="title">{user.title}</div>
        <div className="profile-details">
          <div className="left">
            {user.experience.length && (
              <div>
                <div
                  className="sub-title"
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <Icon src="Edit_Black" width={25} height={25} />}{' '}
                  Experience:
                </div>
                {user.experience.map((exp, i) => (
                  <div key={i} className="exp">
                    <div className="position">{exp.position}</div>
                    <div className="company">{exp.company}</div>
                    <div className="years">{exp.years}</div>
                  </div>
                ))}
              </div>
            )}
            {user.education.length && (
              <div>
                <div
                  className="sub-title"
                  onClick={() => openProfileSetupInStep(1)}
                >
                  {isOwner && <Icon src="Edit_Black" width={25} height={25} />}{' '}
                  Education:
                </div>
                {user.education.map((edu, i) => (
                  <div key={i} className="exp">
                    <div className="position">{edu.fieldOfStudy}</div>
                    <div className="company">{edu.school}</div>
                    <div className="years">{edu.years}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div
                className="sub-title"
                onClick={() => openProfileSetupInStep(2)}
              >
                {' '}
                {isOwner && <Icon src="Edit_Black" width={25} height={25} />}
                {'  '}
                Skills:
              </div>
              <div className="skills">
                {user.skills.map((skill, i) => (
                  <div className="skill-badge" key={i}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="right">
            <div>
              <div
                className="sub-title"
                onClick={() => openProfileSetupInStep(0)}
              >
                {' '}
                {isOwner && <Icon src="Edit_Black" width={25} height={25} />}
                {'  '}
                Bio:
              </div>
              <p className="text">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
