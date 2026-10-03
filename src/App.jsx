import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Umkm from "./pages/Umkm";
import Provider from "./pages/Provider";
import University from "./pages/University";
import EcosystemMap from "./pages/EcosystemMap";
import ArpiProgram from "./pages/ArpiProgram";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/umkm"
          element={<Umkm />}
        />

        <Route
          path="/provider"
          element={<Provider />}
        />

        <Route
          path="/universitas"
          element={<University />}
        />

        <Route
          path="/map"
          element={<EcosystemMap />}
        />

        <Route
          path="/arpi"
          element={<ArpiProgram />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;