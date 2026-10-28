
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./Productos.css";

type Producto = {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  costo: number;
  precio: number;
  activo: boolean;
};

const productosIniciales: Producto[] = [
  {
    id: 1,
    codigo: "MIN-001",
    nombre: "Válvula industrial",
    categoria: "Válvulas",
    costo: 70000,
    precio: 100000,
    activo: true,
  },
  {
    id: 2,
    codigo: "MIN-002",
    nombre: "Manguera de alta presión",
    categoria: "Mangueras",
    costo: 45000,
    precio: 68000,
    activo: true,
  },
  {
    id: 3,
    codigo: "MIN-003",
    nombre: "Acople hidráulico",
    categoria: "Conexiones",
    costo: 18000,
    precio: 28000,
    activo: true,
  },
];

const formatoCLP = (valor: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);

const nuevoProducto = {
  codigo: "",
  nombre: "",
  categoria: "",
  costo: "",
  precio: "",
};

export default function Productos() {
  const [productos, setProductos] =
    useState<Producto[]>(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(nuevoProducto);
  const [error, setError] = useState("");

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) =>
      `${producto.codigo} ${producto.nombre} ${producto.categoria}`
        .toLowerCase()
        .includes(termino),
    );
  }, [productos, busqueda]);

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(nuevoProducto);
    setError("");
    setModalAbierto(true);
  };

  const abrirEdicion = (producto: Producto) => {
    setEditandoId(producto.id);
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      costo: String(producto.costo),
      precio: String(producto.precio),
    });
    setError("");
    setModalAbierto(true);
  };

  const guardarProducto = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const codigo = formulario.codigo.trim();
    const nombre = formulario.nombre.trim();
    const categoria = formulario.categoria.trim();
    const costo = Number(formulario.costo);
    const precio = Number(formulario.precio);

    if (!codigo || !nombre || !categoria) {
      setError("Completa todos los campos.");
      return;
    }

    if (
      formulario.costo.trim() === "" ||
      formulario.precio.trim() === "" ||
      !Number.isFinite(costo) ||
      !Number.isFinite(precio) ||
      costo < 0 ||
      precio <= 0
    ) {
      setError("Ingresa un costo válido y un precio mayor que cero.");
      return;
    }

    const codigoDuplicado = productos.some(
      (producto) =>
        producto.codigo.toLowerCase() === codigo.toLowerCase() &&
        producto.id !== editandoId,
    );

    if (codigoDuplicado) {
      setError("Ya existe un producto con ese código.");
      return;
    }

    if (precio < costo) {
      setError("El precio de lista no puede ser menor que el costo.");
      return;
    }

    if (editandoId !== null) {
      setProductos((actuales) =>
        actuales.map((producto) =>
          producto.id === editandoId
            ? { ...producto, codigo, nombre, categoria, costo, precio }
            : producto,
        ),
      );
    } else {
      setProductos((actuales) => [
        ...actuales,
        {
          id: Math.max(0, ...actuales.map((producto) => producto.id)) + 1,
          codigo,
          nombre,
          categoria,
          costo,
          precio,
          activo: true,
        },
      ]);
    }

    setModalAbierto(false);
    setFormulario(nuevoProducto);
    setError("");
  };

  const eliminarProducto = (id: number) => {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este producto de la lista de demostración?",
    );

    if (confirmado) {
      setProductos((actuales) =>
        actuales.filter((producto) => producto.id !== id),
      );
    }
  };

  const margenPromedio =
    productos.length > 0
      ? productos.reduce(
          (total, producto) =>
            total + ((producto.precio - producto.costo) / producto.precio) * 100,
          0,
        ) / productos.length
      : 0;

  return (
    <main className="products-page">
      <header className="products-heading">
        <div>
          <p className="eyebrow">GESTIÓN COMERCIAL</p>
          <h1>Productos</h1>
          <p>Administra tu catálogo y consulta los márgenes comerciales.</p>
        </div>

        <button className="primary-button" onClick={abrirNuevo}>
          <Plus size={18} />
          Nuevo producto
        </button>
      </header>

      <section className="products-stats">
        <article className="product-stat">
          <div className="stat-icon"><Package size={20} /></div>
          <p>Productos registrados</p>
          <h2>{productos.length}</h2>
        </article>

        <article className="product-stat">
          <div className="stat-icon"><Package size={20} /></div>
          <p>Productos activos</p>
          <h2>{productos.filter((p) => p.activo).length}</h2>
        </article>

        <article className="product-stat">
          <div className="stat-icon"><Package size={20} /></div>
          <p>Margen bruto promedio</p>
          <h2>{margenPromedio.toLocaleString("es-CL", {
            maximumFractionDigits: 1,
          })}%</h2>
        </article>
      </section>

      <section className="products-panel">
        <div className="products-toolbar">
          <div>
            <h2>Catálogo</h2>
            <p>{productosFiltrados.length} productos encontrados</p>
          </div>

          <label className="search-box">
            <Search size={18} />
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o código..."
            />
          </label>
        </div>

        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Costo</th>
                <th>Precio de lista</th>
                <th>Margen bruto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => {
                const margen =
                  ((producto.precio - producto.costo) / producto.precio) * 100;

                return (
                  <tr key={producto.id}>
                    <td>
                      <div className="product-name-cell">
                        <div className="product-avatar">
                          <Package size={19} />
                        </div>
                        <div>
                          <strong>{producto.nombre}</strong>
                          <small>{producto.codigo}</small>
                        </div>
                      </div>
                    </td>
                    <td>{producto.categoria}</td>
                    <td>{formatoCLP(producto.costo)}</td>
                    <td>{formatoCLP(producto.precio)}</td>
                    <td>
                      <span className="margin-value">
                        {margen.toLocaleString("es-CL", {
                          maximumFractionDigits: 1,
                        })}%
                      </span>
                    </td>
                    <td>
                      <span className="status-pill">Activo</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="action-button"
                          title="Editar producto"
                          aria-label={`Editar ${producto.nombre}`}
                          onClick={() => abrirEdicion(producto)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-button delete-action"
                          title="Eliminar producto"
                          aria-label={`Eliminar ${producto.nombre}`}
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalAbierto && (
        <div className="modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalAbierto(false);
        }}>
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <header className="modal-heading">
              <div>
                <p className="eyebrow">CATÁLOGO</p>
                <h2 id="product-modal-title">
                  {editandoId !== null ? "Editar producto" : "Nuevo producto"}
                </h2>
              </div>
              <button
                className="action-button"
                onClick={() => setModalAbierto(false)}
                aria-label="Cerrar formulario"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={guardarProducto}>
              <label>
                Código
                <input
                  required
                  value={formulario.codigo}
                  onChange={(e) =>
                    setFormulario({ ...formulario, codigo: e.target.value })
                  }
                  placeholder="Ej. MIN-004"
                />
              </label>

              <label>
                Nombre del producto
                <input
                  required
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({ ...formulario, nombre: e.target.value })
                  }
                  placeholder="Nombre del producto"
                />
              </label>

              <label>
                Categoría
                <input
                  required
                  value={formulario.categoria}
                  onChange={(e) =>
                    setFormulario({ ...formulario, categoria: e.target.value })
                  }
                  placeholder="Ej. Válvulas"
                />
              </label>

              <div className="form-two-columns">
                <label>
                  Costo (CLP)
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={formulario.costo}
                    onChange={(e) =>
                      setFormulario({ ...formulario, costo: e.target.value })
                    }
                    placeholder="70000"
                  />
                </label>

                <label>
                  Precio de lista (CLP)
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={formulario.precio}
                    onChange={(e) =>
                      setFormulario({ ...formulario, precio: e.target.value })
                    }
                    placeholder="100000"
                  />
                </label>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Guardar producto
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
