
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  GraduationCap,
  Menu,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import "./App.css";

const sections = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Productos", icon: Package },
  { label: "Cotizaciones", icon: FileText },
  { label: "Ventas", icon: ShoppingBag },
  { label: "Simulaciones", icon: GraduationCap },
];

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-closed"}`}>
        <div className="brand">
          <div className="brand-mark">F</div>
          {sidebarOpen && (
            <div>
              <strong>ForgeSales</strong>
              <small>Sales intelligence</small>
            </div>
          )}
        </div>

        <p className="nav-caption">MENÚ PRINCIPAL</p>

        <nav className="nav-list">
          {sections.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => setActivePage(label)}
              title={label}
            >
              <Icon size={19} />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <>
              <strong>ForgeSales</strong>
              <small>Prototipo en desarrollo</small>
            </>
          )}
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Alternar menú"
          >
            <Menu size={21} />
          </button>

          <div className="user-profile">
            <div className="avatar">FS</div>
            <span>Panel comercial</span>
          </div>
        </header>

{activePage === "Dashboard" ? (
  <Dashboard />
) : activePage === "Productos" ? (
  <Productos />
) : (
  <main className="dashboard">
    <p className="eyebrow">FORGESALES</p>
    <h1>{activePage}</h1>
    <p>Este módulo se implementará en la siguiente etapa.</p>
  </main>
)}
      </div>
    </div>
  );
}
