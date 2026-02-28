import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { ROLES, roleHomePath } from "../utils/roles";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await login({ name: name || "Campus User", role });
      navigate(roleHomePath(role));
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form className="card" style={{ width: "360px" }} onSubmit={handleSubmit}>
        <h2>Smart Campus Login</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          <InputField
            id="name"
            label="Name"
            placeholder="Alex Johnson"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label className="input-field" htmlFor="role">
            <span>Role</span>
            <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value={ROLES.ADMIN}>Event Organizer</option>
              <option value={ROLES.FACULTY}>Faculty</option>
              <option value={ROLES.COORDINATOR}>Student Coordinator</option>
            </select>
          </label>
          <Button type="submit">Login</Button>
          {error ? <p style={{ color: "#c62828", margin: 0 }}>{error}</p> : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
