import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import AppRouter from "./router";

import "../styles/variables.css";
import "../styles/global.css";
import "../styles/public.css";
import "../styles/dashboard.css";
import "../styles/responsive.css";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </BrowserRouter>
    );
}