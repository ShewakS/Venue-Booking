import React from "react";

const Button = ({ className = "", children, ...props }) => {
  return (
    <button className={`button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
