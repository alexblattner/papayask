import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase-auth';
import { AuthContext } from './ContextProvider';
import { Navigate } from 'react-router-dom';
import LinkedInTag from 'react-linkedin-insight';
import './Auth.css';
import ReactFacebookPixel from 'react-facebook-pixel';
import SvgIcon from '../shared/SvgIcon';
import googleSvg from './google.svg';
interface Props {
  type: string; //whether it is sign up or log in
}
//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const AuthForm = (props: Props) => {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState(props.type);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordResetDone, setPasswordResetDone] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const google = async () => {
    await auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (userCred: any) => {
        if (userCred) {
          window.localStorage.setItem('auth', 'true');
          ReactFacebookPixel.trackCustom( 'Login', {
            provider: 'google',
            email: userCred.user.email,
          });
          LinkedInTag.init('5072817', 'dc', false);
          LinkedInTag.track('12336353');
        }
      })
      .catch((error) => {
        console.log(12345, error);
      });
  };
  const facebook = async () => {
    await auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(async (userCred: any) => {
        if (userCred) {
          window.localStorage.setItem('auth', 'true');
          ReactFacebookPixel.trackCustom('Login', {
            provider: 'facebook',
            email: userCred.user.email,
          });
          LinkedInTag.init('5072817', 'dc', false);
          LinkedInTag.track('12336353');
        }
      })
      .catch((err) => {
        let message = err.message;
        if (message.includes('email')) {
          message = 'Email already in use';
        }
        alert(message);
      });
  };
  const emailPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let email = (
      (e.target as HTMLInputElement).querySelector(
        '[name="email"]'
      ) as HTMLInputElement
    ).value;
    let password = (
      (e.target as HTMLInputElement).querySelector(
        '[name="password"]'
      ) as HTMLInputElement
    ).value;
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexEmail.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (type == 'login') {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (userCred: any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
            ReactFacebookPixel.trackCustom('Login', {
              provider: 'email',
              email: userCred.user.email,
            });
            LinkedInTag.init('5072817', 'dc', false);
            LinkedInTag.track('12336353');
          }
        })
        .catch((err: any) => {
          setError(err.message);
        });
    } else if (type == 'signup') {
      if (firstName.length < 2 || lastName.length < 2) {
        setError('First and last name must be at least 2 characters long');
        return;
      } else {
        await auth
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCred: any) => {
            if (userCred) {
              window.localStorage.setItem('auth', 'true');
              window.localStorage.setItem('firstName', firstName);
              window.localStorage.setItem('lastName', lastName);
              ReactFacebookPixel.trackCustom('Signup', {
                provider: 'email',
                email: userCred.user.email,
              });
              LinkedInTag.init('5072817', 'dc', false);
              LinkedInTag.track('12336353');
            }
          })
          .catch((err: any) => {
            setError(err.message);
          });
      }
    }
  };
  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let email = (
      (e.target as HTMLInputElement).querySelector(
        '[name="email"]'
      ) as HTMLInputElement
    ).value;
    await auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setPasswordResetDone(true);
      })
      .catch((err: any) => {
        setError(err.message);
      });
  };

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="connection">
      <h2>
        {type == 'login'
          ? 'Log in'
          : type == 'signup'
          ? 'Join Papayask'
          : 'Reset Password'}
      </h2>
      {type == 'reset' ? (
        <form onSubmit={resetPassword}>
          {passwordResetDone ? (
            <div id="after-reset">
              We have sent you an email. Follow the instructions there to reset
              your password.
            </div>
          ) : (
            <div className="merged-input">
              <input type="email" name="email" placeholder="Enter your email" />
              <button type="submit">
                <SvgIcon size={18} src="arrow_right" />
              </button>
            </div>
          )}
          <div id="go-back" onClick={() => setType('login')}>
            <SvgIcon size={18} src="go_back" /> Back to login
          </div>
        </form>
      ) : (
        <>
          <button id="facebook" className="thirdparty" onClick={facebook}>
            <div>
              <SvgIcon size={24} src="facebook" />
              {type == 'login'
                ? 'Log in'
                : type == 'signup'
                ? 'Sign up'
                : ''}{' '}
              with Facebook
            </div>
          </button>
          <button id="google" className="thirdparty" onClick={google}>
            <div>
              <img src={googleSvg} />
              {type == 'login'
                ? 'Log in'
                : type == 'signup'
                ? 'Sign up'
                : ''}{' '}
              with Google
            </div>
          </button>
          <div className="divider">
            <div className="line"></div>OR<div className="line"></div>
          </div>
          <form onSubmit={emailPassword}>
            {type == 'signup' ? (
              <div id="name-inputs">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName((e.target as HTMLInputElement).value)
                  }
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName((e.target as HTMLInputElement).value)
                  }
                />
              </div>
            ) : null}
            {error?.includes('name') ? (
              <div id="error">
                <SvgIcon
                  color="var(--danger)"
                  size={24}
                  src="exclamation_mark_fill"
                />
                {error}
              </div>
            ) : null}
            <input
              type="text"
              placeholder="Enter your email"
              name="email"
              className={
                error?.includes('email')
                  ? 'error'
                  : error?.includes('email-already-in-use')
                  ? 'error'
                  : ''
              }
              onChange={(e) => {
                setEmail((e.target as HTMLInputElement).value);
                setError('');
              }}
            />
            {error?.includes('user-not-found') ? (
              <div id="error">
                <SvgIcon
                  color="var(--danger)"
                  size={24}
                  src="exclamation_mark_fill"
                />
                No user with this email exists
              </div>
            ) : error?.includes('email') ? (
              <div id="error">
                <SvgIcon
                  color="var(--danger)"
                  size={24}
                  src="exclamation_mark_fill"
                />
                {error}
              </div>
            ) : null}
            <input
              onChange={(e) => {
                setPassword((e.target as HTMLInputElement).value);
                setError('');
              }}
              className={
                error?.toLocaleLowerCase().includes('password') ? 'error' : ''
              }
              type="password"
              placeholder="Enter your password"
              name="password"
            />
            {error?.includes('wrong-password') ? (
              <div id="error">
                <SvgIcon
                  color="var(--danger)"
                  size={24}
                  src="exclamation_mark_fill"
                />
                Wrong password
              </div>
            ) : error?.toLocaleLowerCase().includes('password') ? (
              <div id="error">
                <SvgIcon
                  color="var(--danger)"
                  size={24}
                  src="exclamation_mark_fill"
                />
                {error}
              </div>
            ) : null}
            <input
              type="submit"
              value={type == 'login' ? 'Log In!' : 'Sign Up!'}
            />
          </form>
          {type == 'login' ? (
            <span id="forgot-password" onClick={() => setType('reset')}>
              I forgot my password
            </span>
          ) : null}

          <p>
            {type == 'login' ? (
              <>
                Not a member yet?{' '}
                <span onClick={() => setType('signup')}>Join us</span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span onClick={() => setType('login')}>Log In</span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default AuthForm;
