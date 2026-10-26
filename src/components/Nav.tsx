import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Livros" },
  { to: "/plano", label: "Plano" },
  { to: "/busca", label: "Busca" },
  { to: "/ajustes", label: "Ajustes" },
];

export function Nav() {
  return (
    <nav className="nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
