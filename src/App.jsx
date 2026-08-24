import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Home } from "./pages/home";
import { Shop } from "./pages/shop";
import { EventDetail } from "./pages/event-detail";
import { NotFound } from "./pages/not-found";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="events/:eventId" element={<EventDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
