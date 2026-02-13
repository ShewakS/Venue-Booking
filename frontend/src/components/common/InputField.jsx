import React from "react";

const InputField = ({ label, id, ...props }) => {
  return (
    <label className="input-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
    </label>
  );
};

export default InputField;
