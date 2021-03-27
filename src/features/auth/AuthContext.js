import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const initialValue = {
    isAuthenticated: false,
    user: null,
}

const AuthContext = React.createContext(initialValue);

function AuthContextProvider({children}) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              setValue({isAuthenticated: true, user});
            } else {
              // User is signed out.
              setValue(initialValue);
            }
          });
    }, []);

    return (
        <AuthContext.Provider value={ value }>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthContextProvider}