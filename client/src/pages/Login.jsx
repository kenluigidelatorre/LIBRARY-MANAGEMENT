import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

function LibraryMark() {
  return <div className="auth-logo"><BookOpen size={23} strokeWidth={2.2} /></div>;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("Login interface is ready. Backend authentication will be connected in the next step.");
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-login">
        <LibraryMark />
        <h1>WELCOME BACK!</h1>
        <p className="auth-subtitle">Sign in to your library account</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-input-wrap">
            <Mail size={15} />
            <input type="email" placeholder="Email address" aria-label="Email address" required />
          </label>
          <label className="auth-input-wrap">
            <LockKeyhole size={15} />
            <input type={showPassword ? "text" : "password"} placeholder="Password" aria-label="Password" required />
            <button className="password-toggle" type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </label>
          <div className="auth-options">
            <label className="remember-option"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> <span>Remember me</span></label>
            <button type="button" className="auth-text-button" onClick={() => setNotice("Forgot Password will be available when authentication is connected.")}>Forgot password?</button>
          </div>
          <button className="auth-submit" type="submit">Log in</button>
        </form>
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </section>
    </main>
  );
}
