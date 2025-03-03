import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import LoginPage from "./pages/Authentication/LoginPage";
import Chart from "./pages/Chart";
import ECommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tables from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import DefaultLayout from "./layout/DefaultLayout";
import TableThree from "./components/Tables/TableThree";
import House from "./pages/House/House";
import Flat from "./pages/House/Flat";
import Room from "./pages/House/Room";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("token"); // Check token from localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Routes>
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="Dashboard" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/house-owners"
                  element={
                    <>
                      <PageTitle title="House Owners" />
                      <TableThree />
                    </>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/flats" element={<Flat />} />
                <Route path="/rooms" element={<Room />} />
                <Route path="/forms/form-elements" element={<FormElements />} />
                <Route path="/forms/form-layout" element={<FormLayout />} />
                <Route path="/users" element={<Tables />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chart" element={<Chart />} />
                <Route path="/ui/alerts" element={<Alerts />} />
                <Route path="/ui/buttons" element={<Buttons />} />
              </Routes>
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
