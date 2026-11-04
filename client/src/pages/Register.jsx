import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

function LibraryMark() {
  return <div className="auth-logo"><BookOpen size={23} strokeWidth={2.2} /></div>;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setNotice("Passwords do not match. Please check and try again.");
      return;
    }
    setNotice("Registration interface is ready. Account creation will be connected to the backend in the next step.");
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-register">
        <LibraryMark />
        <h1>Create an Account</h1>
        <p className="auth-subtitle">Join the IDSC Library Management System</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-input-wrap">
            <UserRound size={15} />
            <input name="fullName" type="text" placeholder="Full Name" aria-label="Full name" autoComplete="name" required />
          </label>
          <label className="auth-input-wrap">
            <Mail size={15} />
            <input name="email" type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" required />
          </label>
          <label className="auth-input-wrap">
            <LockKeyhole size={15} />
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" aria-label="Password" autoComplete="new-password" minLength="8" required />
            <button className="password-toggle" type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </label>
          <label className="auth-input-wrap">
            <LockKeyhole size={15} />
            <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirm Password" aria-label="Confirm password" autoComplete="new-password" minLength="8" required />
            <button className="password-toggle" type="button" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </label>
          <div className="auth-options auth-register-options">
            <span className="auth-small-note">Use at least 8 characters for your password.</span>
          </div>
          <button className="auth-submit" type="submit">Create account</button>
        </form>
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
