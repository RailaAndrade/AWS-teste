import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Auth, { CognitoUser } from "@aws-amplify/auth"
interface AuthState {
  token: string;
  user: CognitoUser;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: CognitoUser | null | undefined
  signInFunction(credentials: SignInCredentials): Promise<void> | undefined;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null)
  const signInFunction = useCallback(async ({ email, password }) => {
    try {
      const user = await Auth.signIn(email, password)
      setUser(user)
    } catch (err) {
      console.log(err)
    }
  }, [user, setUser]);

  const signOut = React.useCallback(async () => {
    await Auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user: user, signInFunction, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export { AuthProvider, useAuth };
