import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../logic/auth";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = loginUser(form.email, form.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <main className="government-login">
      <header className="top-brand">
        <div className="brand-symbol">
          <span></span>
        </div>

        <div className="brand-text">
          <strong>SESARENG</strong>
          <small>Regional Productivity Platform</small>
        </div>
      </header>

      <div className="login-main">
        {/* LEFT */}
        <section className="login-form-section">
          <div className="login-content">
            <div className="government-badge">
              Portal Pemerintah
            </div>

            <h1>Selamat datang</h1>

            <p className="login-description">
              Akses sistem koordinasi produktivitas UMKM dan ekosistem
              pendukung Sesareng.
            </p>

            <form onSubmit={handleSubmit} className="main-form">
              <div className="field-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="pemda@sesareng.id"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="password">Password</label>

                <div className="password-field">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button type="submit" className="login-submit">
                Masuk ke Dashboard
              </button>
            </form>

            <div className="demo-section">
              <span>Akun prototype</span>

              <div className="demo-info">
                <strong>pemda@sesareng.id</strong>
                <p>Password: 123456</p>
              </div>
            </div>

            <p className="prototype-note">
              Prototype untuk demonstrasi sistem koordinasi pemerintah.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="ecosystem-visual">
          <div className="visual-center">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="bubble government-bubble">
              <span className="bubble-icon">🏛</span>

              <div className="bubble-tooltip">
                Pemerintah
              </div>
            </div>

            <div className="bubble umkm-bubble">
              <span className="bubble-icon">🏪</span>

              <div className="bubble-tooltip">
                UMKM
              </div>
            </div>

            <div className="bubble provider-bubble">
              <span className="bubble-icon">⚙</span>

              <div className="bubble-tooltip">
                Provider
              </div>
            </div>

            <div className="bubble university-bubble">
              <span className="bubble-icon">🎓</span>

              <div className="bubble-tooltip">
                Perguruan Tinggi
              </div>
            </div>

            <div className="bubble map-bubble">
              <span className="bubble-icon">⌖</span>

              <div className="bubble-tooltip">
                Peta Ekosistem
              </div>
            </div>

            <div className="bubble arpi-bubble">
              <span className="bubble-icon">◎</span>

              <div className="bubble-tooltip">
                Program ARPI
              </div>
            </div>

            <span className="small-dot dot-blue"></span>
            <span className="small-dot dot-green"></span>
            <span className="small-dot dot-yellow"></span>
            <span className="small-dot dot-navy"></span>

            <div className="visual-copy">
              <span>SESARENG</span>

              <h2>
                Satu ekosistem,
                <br />
                intervensi yang tepat.
              </h2>

              <p>
                Standardize the goal.
                <br />
                Localize the pathway.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <div className="footer-brand">
          <div className="footer-symbol"></div>
          <strong>SESARENG</strong>
        </div>

        <p>
          Adaptive Regional Productivity Intervention
        </p>
      </footer>
    </main>
  );
}

export default Login;