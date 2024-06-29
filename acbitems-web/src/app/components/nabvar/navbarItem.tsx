// components/NavBar.tsx
import "../../styles/navbar.css";
import React from "react";

// Define la interfaz para las props porque estamos usando TypeScript
interface NavBarProps {
  text?: string;
}

// Modifica el componente para aceptar las props tipadas
export function NavBarItem({ text }: NavBarProps) {
  return (
    <div className="navBar-container">
      <a>
        <p>{text || "All"}</p>
      </a>
    </div>
  );
}
