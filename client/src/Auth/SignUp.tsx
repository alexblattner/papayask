import React, { useContext, useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from "../firebase-auth";
import { AuthContext } from "./ContextProvider";
type LoginProps = {
  setAuth: Function,
}
//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const SignUp = (props: LoginProps ) => {
    const user = useContext(AuthContext);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [emailOption, setEmailOption] = useState<boolean>(false);
    const google=async()=>{
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then((userCred:any) => {
                console.log(userCred);
				if (userCred) {
					props.setAuth(true);
					window.localStorage.setItem('auth', 'true');
				}
			});
            console.log(44444,auth)
    }
    useEffect(() => {
        console.log(292923,user);
    }, [user]);
    return (
      <>
        {!emailOption?
        <div className="options">
            <button onClick={google}>google</button>
        </div>:<form><input type="text" /><input type="password" /><input type="text" /></form>}
      </>
    );
};

export default SignUp;