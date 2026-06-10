import { useState, useEffect } from "react";

function ModuloReportes() {
    const [prestamos, setPrestamos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Texto que escribe el usuario para filtrar

    useEffect(() => {
        // Para reportar necesitamos los préstamos y los clientes
        const prestamosGuardados = localStorage.getItem("prestamos_biblioteca");
        if (prestamosGuardados) {
            setPrestamos(JSON.parse(prestamosGuardados));
        }

        const clientesGuardados = localStorage.getItem("clientes_biblioteca");
        if (clientesGuardados) {
            setClientes(JSON.parse(clientesGuardados));
        }
    }, []);

    // Nombre completo del cliente a partir de su id
    const obtenerNombreCliente = (id) => {
        const cliente = clientes.find((c) => c.id === id);
        return cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no encontrado";
    };

    // Buscamos el ISBN del libro en su localStorage para poder filtrar por él
    const obtenerIsbnLibro = (libroId) => {
        const libros = JSON.parse(localStorage.getItem("libros_biblioteca")) || [];
        const libro = libros.find((l) => l.id === libroId);
        return libro ? libro.isbn : "";
    };

    // Filtramos la lista según lo que se escriba: por ISBN, título o nombre del cliente
    const prestamosFiltrados = prestamos.filter((p) => {
        const texto = busqueda.toLowerCase().trim();

        // Sin texto mostramos todos los préstamos
        if (texto === "") {
            return true;
        }

        const nombreCliente = obtenerNombreCliente(p.clienteId).toLowerCase();
        const isbn = obtenerIsbnLibro(p.libroId).toLowerCase();
        const titulo = p.tituloLibro.toLowerCase();

        return (
            nombreCliente.includes(texto) ||
            isbn.includes(texto) ||
            titulo.includes(texto)
        );
    });

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "white", textAlign: "center" }}>Reportería de Préstamos</h2>

            <div className="contenedor" style={{ marginTop: "20px", maxWidth: "800px" }}>
                <h3 style={{ textAlign: "center", color: "#2a5298" }}>Consultar Historial de Préstamos</h3>

                <input
                    type="text"
                    placeholder="Buscar por ISBN, título o nombre del usuario..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: "12px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", width: "100%", marginBottom: "20px" }}
                />

                {prestamosFiltrados.length === 0 ? (
                    <p>No se encontraron préstamos con ese criterio.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {prestamosFiltrados.map((prestamo) => (
                            <li key={prestamo.id} style={{ backgroundColor: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px" }}>
                                <strong>{prestamo.tituloLibro}</strong> (ISBN: {obtenerIsbnLibro(prestamo.libroId)})
                                <br />
                                <small>
                                    Usuario: {obtenerNombreCliente(prestamo.clienteId)} |
                                    Fecha préstamo: {prestamo.fechaPrestamo} |
                                    Fecha devolución: {prestamo.fechaDevolucion} |
                                    Estado: <strong style={{ color: prestamo.estado === "activo" ? "#f5a623" : "#22c55e" }}>{prestamo.estado}</strong>
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ModuloReportes;