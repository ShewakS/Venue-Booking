import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { ROLES, roleHomePath } from "../utils/roles";
import { loginHeroImage } from "../assets/images";

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [phone, setPhone] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      // Validate email domain during registration
      if (mode === "register" && !email.endsWith("@sece.ac.in")) {
        setError("Please enter a valid email ending with @sece.ac.in");
        return;
      }

      let user = null;
      if (mode === "register") {
        const result = await register({
          name: name || "Campus User",
          email,
          password,
          role,
          phone,
          roleDescription,
        });

        setError(
          result?.message ||
            "Registration submitted. Your account is pending admin approval. Please login after approval."
        );
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRoleDescription("");
        return;
      } else {
        user = await login({
          email,
          password,
        });
      }

      navigate(roleHomePath(user?.role || role));
    } catch (err) {
      const message = err?.response?.data?.message || "Authentication failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="login-shell" style={{ backgroundImage: `url('${loginHeroImage}')` }}>
      <div className="login-layout card">
        <div className="login-content">
          <div className="login-content-head">
            <h3>Sri Eshwar College of Engineering</h3>
            <span className="login-accent-line" />
            <p className="muted">Smart Campus Space Booking Portal</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h4>{mode === "register" ? "Create Account" : "Access Dashboard"}</h4>

            <div className="login-fields">
              {mode === "register" ? (
                <InputField
                  id="name"
                  label="Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              ) : null}

              {mode === "register" ? (
                <InputField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              ) : null}

              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="your.name@sece.ac.in"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {mode === "register" ? (
                <label className="input-field" htmlFor="role">
                  <span>Role</span>
                  <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.FACULTY}>Faculty</option>
                    <option value={ROLES.STUDENT}>Student</option>
                  </select>
                </label>
              ) : null}

              {mode === "register" ? (
                <InputField
                  id="roleDescription"
                  label="Role Description"
                  placeholder="Enter your position"
                  value={roleDescription}
                  onChange={(event) => setRoleDescription(event.target.value)}
                />
              ) : null}

              <Button type="submit">{mode === "register" ? "Create Account" : "Access Dashboard"}</Button>
              {error ? <p style={{ color: "#c62828", margin: 0 }}>{error}</p> : null}

              <Button
                type="button"
                className="secondary"
                onClick={() => {
                  setError("");
                  setMode((prev) => (prev === "login" ? "register" : "login"));
                }}
              >
                {mode === "login" ? "Create Account" : "Back to Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
