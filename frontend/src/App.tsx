import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Signin";
// import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PatientAdd from "./pages/PatientAdd";
import Patient from "./pages/Patient";
import Report from "./pages/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addpatient"
          element={
            <ProtectedRoute>
              <PatientAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute>
              <Patient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />{" "}
        {/* Catch-all route for 404 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
