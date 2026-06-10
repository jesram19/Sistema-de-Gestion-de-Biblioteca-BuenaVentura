import { useState, useEffect } from "react";

function ModuloPrestamos() {
    const [prestamos, setPrestamos] = useState([]);
    const [libros, setLibros] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState("");

    // Campos del formulario: qué cliente, qué libro y para cuándo lo devuelve
    const [libroId, setLibroId] = useState("");
    const [clienteId, setClienteId] = useState("");
    const [fechaDevolucion, setFechaDevolucion] = useState("");

    useEffect(() => {
        // Este módulo necesita los tres: préstamos, libros y clientes
        const prestamosGuardados = localStorage.getItem("prestamos_biblioteca");
        if (prestamosGuardados) {
            setPrestamos(JSON.parse(prestamosGuardados));
        }

        const librosGuardados = localStorage.getItem("libros_biblioteca");
        if (librosGuardados) {
            setLibros(JSON.parse(librosGuardados));
        }

        const clientesGuardados = localStorage.getItem("clientes_biblioteca");
        if (clientesGuardados) {
            setClientes(JSON.parse(clientesGuardados));
        }
    }, []);

    // Devuelve la fecha de hoy como texto AAAA-MM-DD para comparar fácil
    const fechaHoy = () => {
        return new Date().toISOString().split("T")[0];
    };

    const manejarSubmit = (e) => {
        e.preventDefault();

        // Tiene que haber un cliente y un libro elegidos
        if (libroId === "" || clienteId === "") {
            setError("Debe seleccionar un libro y un cliente.");
            return;
        }

        // El préstamo necesita una fecha de devolución
        if (fechaDevolucion.trim() === "") {
            setError("El préstamo debe tener una fecha de devolución esperada.");
            return;
        }

        const hoy = fechaHoy();

        // Regla: un cliente no puede tener dos libros prestados sin devolver
        const clienteConPrestamoActivo = prestamos.find(
            (p) => p.clienteId === Number(clienteId) && p.estado === "activo"
        );
        if (clienteConPrestamoActivo) {
            setError("Este cliente ya tiene un libro prestado y no ha sido devuelto.");
            return;
        }

        // Regla: el mismo libro no se presta dos veces el mismo día
        const libroAsignadoHoy = prestamos.find(
            (p) => p.libroId === Number(libroId) && p.fechaPrestamo === hoy && p.estado === "activo"
        );
        if (libroAsignadoHoy) {
            setError("Este libro ya fue asignado a otra persona el día de hoy.");
            return;
        }

        // Regla: no se presta si no quedan ejemplares
        const libroSeleccionado = libros.find((l) => l.id === Number(libroId));
        if (!libroSeleccionado || libroSeleccionado.cantidad <= 0) {
            setError("No hay ejemplares disponibles de este libro.");
            return;
        }

        setError("");

        // Armamos el nuevo préstamo. Guardamos el título para mostrarlo fácil después
        const nuevoPrestamo = {
            id: Date.now(),
            libroId: Number(libroId),
            clienteId: Number(clienteId),
            tituloLibro: libroSeleccionado.titulo,
            fechaPrestamo: hoy,
            fechaDevolucion: fechaDevolucion,
            estado: "activo"
        };

        const nuevaListaPrestamos = [...prestamos, nuevoPrestamo];
        setPrestamos(nuevaListaPrestamos);
        localStorage.setItem("prestamos_biblioteca", JSON.stringify(nuevaListaPrestamos));

        // Al prestar bajamos en 1 la cantidad disponible del libro
        const librosActualizados = libros.map((l) =>
            l.id === Number(libroId) ? { ...l, cantidad: l.cantidad - 1 } : l
        );
        setLibros(librosActualizados);
        localStorage.setItem("libros_biblioteca", JSON.stringify(librosActualizados));

        // Limpiamos el formulario
        setLibroId("");
        setClienteId("");
        setFechaDevolucion("");
    };

    const devolverLibro = (prestamo) => {
        // Marcamos el préstamo como devuelto
        const nuevaListaPrestamos = prestamos.map((p) =>
            p.id === prestamo.id ? { ...p, estado: "devuelto" } : p
        );
        setPrestamos(nuevaListaPrestamos);
        localStorage.setItem("prestamos_biblioteca", JSON.stringify(nuevaListaPrestamos));

        // Y le devolvemos el ejemplar al libro sumando 1 a su cantidad
        const librosActualizados = libros.map((l) =>
            l.id === prestamo.libroId ? { ...l, cantidad: l.cantidad + 1 } : l
        );
        setLibros(librosActualizados);
        localStorage.setItem("libros_biblioteca", JSON.stringify(librosActualizados));
    };

    // Buscamos el nombre del cliente por su id para mostrarlo en la lista
    const obtenerNombreCliente = (id) => {
        const cliente = clientes.find((c) => c.id === id);
        return cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no encontrado";
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "white", textAlign: "center" }}>Gestión de Préstamos</h2>

            <div className="contenedor" style={{ marginTop: "20px" }}>
                <h3 style={{ textAlign: "center", color: "#2a5298" }}>Registrar Nuevo Préstamo</h3>
                {error && <p className="mensaje-error">{error}</p>}

                <form className="formulario" onSubmit={manejarSubmit}>
                    {/* Lista desplegable con los clientes registrados */}
                    <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={{ padding: "12px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}>
                        <option value="">-- Seleccione un cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre} {c.apellido} ({c.identificacion})</option>
                        ))}
                    </select>

                    {/* Lista desplegable con los libros y cuántos quedan */}
                    <select value={libroId} onChange={(e) => setLibroId(e.target.value)} style={{ padding: "12px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}>
                        <option value="">-- Seleccione un libro --</option>
                        {libros.map((l) => (
                            <option key={l.id} value={l.id}>{l.titulo} (Disponibles: {l.cantidad})</option>
                        ))}
                    </select>

                    <label style={{ color: "#2a5298", fontWeight: "bold" }}>Fecha de devolución esperada:</label>
                    <input type="date" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} />

                    <button type="submit">Registrar Préstamo</button>
                </form>
            </div>

            <div className="contenedor" style={{ maxWidth: "800px" }}>
                <h3 style={{ color: "#2a5298" }}>Préstamos Registrados ({prestamos.length})</h3>
                {prestamos.length === 0 ? (
                    <p>No hay préstamos registrados.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {prestamos.map((prestamo) => (
                            <li key={prestamo.id} style={{ backgroundColor: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{prestamo.tituloLibro}</strong>
                                    <br />
                                    <small>
                                        Cliente: {obtenerNombreCliente(prestamo.clienteId)} |
                                        Préstamo: {prestamo.fechaPrestamo} |
                                        Devolución: {prestamo.fechaDevolucion} |
                                        Estado: <strong style={{ color: prestamo.estado === "activo" ? "#f5a623" : "#22c55e" }}>{prestamo.estado}</strong>
                                    </small>
                                </div>
                                {/* El botón de devolver solo aparece si el préstamo sigue activo */}
                                {prestamo.estado === "activo" && (
                                    <button onClick={() => devolverLibro(prestamo)} style={{ backgroundColor: "#22c55e", padding: "8px" }}>Devolver</button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ModuloPrestamos;