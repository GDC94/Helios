import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, Home, NotFound } from "./pages";
import DashboardLayout from "./layouts/DashboardLayout";
import { APP_ROUTES } from "@/config/routes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Home />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
