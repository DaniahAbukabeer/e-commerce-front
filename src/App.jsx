import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Home } from "./pages/home";
import { Shop } from "./pages/shop";
import { EventDetail } from "./pages/event-detail";
import { MailClub } from "./pages/mail-club";
import { NotFound } from "./pages/not-found";

import AdminLayout from "./layouts/AdminLayout";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminPointOfSale } from "./pages/admin/PointOfSale";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminOrderDetail } from "./pages/admin/OrderDetail";
import { AdminStock } from "./pages/admin/Stock";
import { AdminEvents } from "./pages/admin/Events";
import { AdminEventDetail } from "./pages/admin/EventDetail";
import { AdminMailClub } from "./pages/admin/MailClub";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="events/:eventId" element={<EventDetail />} />
          <Route path="mail-club" element={<MailClub />} />
        </Route>

        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pos" element={<AdminPointOfSale />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          <Route path="stock" element={<AdminStock />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="events/:eventId" element={<AdminEventDetail />} />
          <Route path="mail-club" element={<AdminMailClub />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
