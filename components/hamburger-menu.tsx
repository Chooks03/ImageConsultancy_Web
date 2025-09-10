import React, { useState } from "react";
import "./hamburger.css";

type HamburgerMenuProps = {
  onClick?: (checked: boolean) => void;
};

export default function HamburgerMenu({ onClick }: HamburgerMenuProps) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <input
        type="checkbox"
        id="hi"
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          if (onClick) onClick(!checked);
        }}
        style={{ position: "absolute", left: "-999px", top: "-999px" }}
      />
      <label className="menu" htmlFor="hi">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </label>
    </>
  );
}
