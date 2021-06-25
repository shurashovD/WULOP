import { createContext } from "react";

const noop = () => {}

export const AuthContext = createContext({
    token: null,
    device: null,
    description: null,
    login: noop,
    logout: noop,
    isAuthenticated: false,
});