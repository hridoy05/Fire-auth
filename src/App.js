import React, { useState } from 'react';

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);


function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''

  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL


        }
        setUser(signedInUser);
        // console.log(displayName,email,photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          password: '',
          error: '',
          isValid: false,
          existingUser : false


        }
        setUser(signOutUser)

      })
      .catch(err => {

      })
  }



  //perform validation
  const is_valid_email = email => /^.-+@.+\..+$/.test(email);
  const hasNumber = input => /\d/.test(input);
  
  const switchForm = event =>{
    const createdUser = { ...user };
      createdUser.existingUser = event.target.checked    
          setUser(createdUser)
    console.log(event.target.checked)
    
  }
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }


    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;

    setUser(newUserInfo);

  }



  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)

        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
    }
    else {
      console.log("form is not valid", user)
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event =>{
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser)

        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser)
        })
    event.preventDefault();
    event.target.reset();
  }
  }
  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>

      }
      {
        user.isSignedIn && <p>Welcome, {user.name}</p>
      }
      

      <h1>Our Authentication</h1>
      <input type="checkbox"  name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor = "switchForm"> returning user</label>

      <form style={{display:user.existingUser? 'block': 'none'}} onSubmit={signInUser}>
        
        <input type="text" onBlur={handleChange} name="email" placeholder="Your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" required placeholder="Your password" />
        <br />
        <input type="submit" value ="signIn"/>

      </form>
      <form style={{display:user.existingUser? 'none': 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your name" required />
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder="Your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" required placeholder="Your password" />
        <br />
        <button type="submit"   onSubmit={createAccount}>Create Account</button>

      </form>
      {
        user.error && <p style ={{color:'red'}}>{user.error}</p>
      }


    </div>
  );
}

export default App;
