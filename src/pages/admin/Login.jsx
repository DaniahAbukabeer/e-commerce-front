import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
// import Image from "next/image";
import "../../AdminApp.css";
import { mascot } from "../../assets/mascot";
import { useAdminAuth } from "../../auth/AdminAuth";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login paper-grain">
      <img src={mascot.wander} alt="" className="admin-login__mascot" />
      <img src={mascot.crafting} alt="" className="admin-login__mascot1" />
      <img src={mascot.housecall} alt="" className="admin-login__mascot2" />

      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__brand">
          {/* <span className="admin-login__brand-icon">
            <Palette size={17} strokeWidth={2.25} />
          </span> */}
          <div className="admin-login__brand-text">
            {/* <strong>Área de Arte</strong> */}
            <img
              src="/Logo.png"
              alt=""
              style={{ width: "250px", height: "auto",  }}
            //   className="admin-login__brand-icon"
            />
            <span>Studio admin</span>
          </div>
        </div>

        <h1>Sign in</h1>
        <p className="admin-login__sub">
          Manage orders, stock, events, and the Mail Club.
        </p>
        {error && <p className="admin-login__sub" role="alert">{error}</p>}

        <label className="admin-login__field">
          <span className="admin-login__label">Email</span>
          <input
            type="email"
            required
            className="admin-login__input"
            placeholder="you@areadearte.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="admin-login__field">
          <span className="admin-login__label">Password</span>
          <input
            type="password"
            required
            className="admin-login__input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className="admin-login__row">
          <label className="admin-login__checkbox">
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#" className="admin-login__forgot">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="admin-login__submit" disabled={submitting}>
          <LogIn size={16} />
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="admin-login__footer">
          <a href="/">← Back to the site</a>
        </p>
      </form>
    </div>
  );
};