
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Target,
  ArrowUpRight,
} from "lucide-react";

const metrics = [
  {
    title: "Ventas del mes",
    value: "$12.450.000",
    detail: "Facturación de ejemplo",
    icon: ShoppingCart,
  },
  {
    title: "Cotizaciones",
    value: "48",
    detail: "Solicitudes registradas",
    icon: Target,
  },
  {
    title: "Clientes activos",
    value: "32",
    detail: "Clientes de ejemplo",
    icon: Users,
  },
  {
    title: "Conversión",
    value: "35,4%",
    detail: "Indicador ilustrativo",
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <main className="dashboard">
      <header className="page-heading">
        <div>
          <p className="eyebrow">CENTRO DE CONTROL</p>
          <h1>Dashboard</h1>
          <p>Resumen comercial de ForgeSales.</p>
        </div>

        <span className="demo-label">Datos de demostración</span>
      </header>

      <section className="metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="metric-card" key={metric.title}>
              <div className="metric-top">
                <span>{metric.title}</span>
                <Icon size={20} />
              </div>

              <h2>{metric.value}</h2>
              <p>{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="welcome-card">
        <div>
          <p className="eyebrow">FORGESALES</p>
          <h2>Gestiona tus ventas con más claridad.</h2>
          <p>
            Controla productos, prepara cotizaciones y analiza
            el rendimiento comercial desde un solo lugar.
          </p>
        </div>

        <ArrowUpRight size={32} />
      </section>
    </main>
  );
}
