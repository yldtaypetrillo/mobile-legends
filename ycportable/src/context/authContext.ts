import { createContext } from "react";

const AUTH_CONTEXT_ERROR =
  "Authentication context not found. Have your wrapped your components with AuthContext.Consumer?";

export const AuthContext = createContext<{
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}>({
  isSignedIn: false,
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
});
