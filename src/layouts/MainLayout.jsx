import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="paper-grain torn-sides" style={{ marginRight: "" }}>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
