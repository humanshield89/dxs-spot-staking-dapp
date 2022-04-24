import React from "react";

const Logo = (props) => {
  return (
    <div style={{ padding: "3px" }}>
      <img
        alt="Logo"
        height={props.height ? props.height : 120}
        src={"/images/logo.png"}
        {...props}
      />
    </div>
  );
};

export default Logo;
