import "./App.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import BerandaPage from "./pages/BerandaPage";
import AkademiArus from "./pages/AkademiArus";
import ProfileNasabah from "./pages/ProfileNasabah";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<BerandaPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route path="/akademiarus" element={<AkademiArus />} />
          <Route path="/ProfileNasabah" element={<ProfileNasabah />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>404: Halaman Tidak Ditemukan</h1>
                <a href="/login">Kembali ke Login</a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
