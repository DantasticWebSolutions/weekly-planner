import React, { useContext, useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';

const AuthContext = React.createContext(db);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(auth.currentUser);
      localStorage.setItem('userUID', auth.currentUser.uid);
      return;
    }
    setIsAuthenticated(false);
    return;
  });

  function signup(email, password) {
    // const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setCurrentUser(user);
        console.log(currentUser);
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  }

  function login(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setCurrentUser(user);

        console.log(currentUser);
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  }
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider);
    // .then((result) => {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential.accessToken;
    //   // The signed-in user info.
    //   const user = result.user;
    //   // ...
    // })
    // .catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // The email of the user's account used.
    //   const email = error.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // });
  }
  function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    updatePassword(currentUser, password)
      .then(() => {
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  }

  function getDatabase() {
    return db;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updateUserPassword,
    signInWithGoogle,
    signInWithFacebook,
    getDatabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
