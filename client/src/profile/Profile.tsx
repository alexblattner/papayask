import React from 'react';
import Icon from '../shared/Icon';
import { socialName } from '../utils/socialName';

import './profile.css';

const user = {
  name: 'John Doe',
  title: 'Software Engineer',
  photo: 'https://source.unsplash.com/random',
  coverPhoto: 'https://source.unsplash.com/random/2000x500',
  bio: 'I am a software engineer',
  skills: ['JavaScript', 'React', 'Node.js'],
  education: [
    {
      school: 'University of California, Los Angeles',
      degree: 'B.S. Computer Science',
      years: '2014-2018',
    },
    {
      school: 'University of California, Los Angeles',
      degree: 'B.S. Mathematics',
      years: '2014-2018',
    },
  ],
  experience: [
    {
      company: 'Google',
      position: 'Frontend Developer',
      years: '2016 - 2018',
    },
    {
      company: 'Facebook',
      position: 'Frontend Developer',
      years: '2018 - 2020',
    },
    {
      company: 'Amazon',
      position: 'Frontend Developer',
      years: '2020 - Present',
    },
  ],
  socials: [
    'https://facebook.com',
    'https://instagram.com',
    'https://youtube.com',
  ],
};

const Profile = () => {
  const [isOwner, setIsOwner] = React.useState<boolean>(true);
  return (
    <section className="profile-page">
      <div className="cover-img-container">
        <img className="cover-img" src={user.coverPhoto} alt="cover-img" />
      </div>
      <div className="profile-img-container">
        <img className="profile-img" src={user.photo} alt="profile-img" />
      </div>
      <div className="profile-info">
        <div className="info-head">
          <div className="user-rating">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Icon src="Star_Fill" width={41} height={41} key={i} />
              ))}
            <p className="rating-number">(12)</p>
          </div>
          <div className="actoins">
            {isOwner ? (
              <button className="edit-profile">
                {' '}
                <Icon src="Edit_White" /> EDIT
              </button>
            ) : (
              <div className="actions-buttons-group">
                <button>
                  <Icon src="Send" width={41} height={41} />
                </button>
                <button>
                  <Icon src="Share" width={41} height={41} />
                </button>
                <button>
                  <Icon src="Heart" width={41} height={41} />
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
                <div className="sub-title">
                  {isOwner && <Icon src="Edit_Black" width={20} height={20} />}{' '}
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
                <div className="sub-title">
                  {isOwner && <Icon src="Edit_Black" width={20} height={20} />}{' '}
                  Education:
                </div>
                {user.education.map((edu, i) => (
                  <div key={i} className="exp">
                    <div className="position">{edu.degree}</div>
                    <div className="company">{edu.school}</div>
                    <div className="years">{edu.years}</div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="sub-title">
                {' '}
                {isOwner && <Icon src="Edit_Black" width={20} height={20} />}
                {'  '}
                Skills:
              </div>
              <div className="skills">
                {user.skills.map((skill, i) => (
                  <div className="skill-badge" key={i}>{skill}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="right">
            <div>
              <div className="sub-title">
                {' '}
                {isOwner && <Icon src="Edit_Black" width={20} height={20} />}
                {'  '}
                Bio:
              </div>
              <p className="text">{user.bio}</p>
            </div>
            <div>
              <div className="sub-title">
                {' '}
                {isOwner && <Icon src="Edit_Black" width={20} height={20} />}
                {'  '}
                Social:
              </div>
              <div className="social-icons">
                {user.socials.map((social, i) => (
                  <Icon
                    src={socialName(social)}
                    width={32}
                    height={32}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
