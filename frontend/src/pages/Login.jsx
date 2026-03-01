import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { ROLES, roleHomePath } from "../utils/roles";

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      let user = null;
      if (mode === "register") {
        user = await register({
          name: name || "Campus User",
          email,
          password,
          role,
        });
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
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form className="card" style={{ width: "360px" }} onSubmit={handleSubmit}>
        <h2>{mode === "register" ? "Create Account" : "Smart Campus Login"}</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {mode === "register" ? (
            <InputField
              id="name"
              label="Name"
              placeholder="Alex Johnson"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          ) : null}

          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
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
                <option value={ROLES.ADMIN}>Event Organizer</option>
                <option value={ROLES.FACULTY}>Faculty</option>
                <option value={ROLES.COORDINATOR}>Student Coordinator</option>
              </select>
            </label>
          ) : null}

          <Button type="submit">{mode === "register" ? "Register" : "Login"}</Button>
          {error ? <p style={{ color: "#c62828", margin: 0 }}>{error}</p> : null}

          <Button
            type="button"
            className="secondary"
            onClick={() => {
              setError("");
              setMode((prev) => (prev === "login" ? "register" : "login"));
            }}
          >
            {mode === "login" ? "First time user? Register" : "Already registered? Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
