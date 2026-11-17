import { Outlet } from "react-router-dom";
import "../../styles/public.css";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
    return (
        <div className="public-site">
            <Header />

            <main>
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
}