import { useState, useEffect } from "react";

function ModuloUsuarios() {
    const [clientes, setClientes] = useState([]);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [error, setError] = useState("");

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [identificacion, setIdentificacion] = useState("");

    useEffect(() => {
        const datosGuardados = localStorage.getItem("clientes_biblioteca");
        if (datosGuardados) {
            setClientes(JSON.parse(datosGuardados));
        } else {
            // Usuarios base de tu archivo Biblioteca.json
            const clientesBase = [
                { id: 201, nombre: "Juan", apellido: "Perez", correo: "juan.perez@gmail.com", telefono: "5555-1111", identificacion: "DPI-101" },
                { id: 202, nombre: "Maria", apellido: "Garcia", correo: "maria.garcia@gmail.com", telefono: "5555-2222", identificacion: "DPI-102" }
            ];
            setClientes(clientesBase);
            localStorage.setItem("clientes_biblioteca", JSON.stringify(clientesBase));
        }
    }, []);

    useEffect(() => {
        if (clienteEditando) {
            setNombre(clienteEditando.nombre);
            setApellido(clienteEditando.apellido);
            setCorreo(clienteEditando.correo);
            setTelefono(clienteEditando.telefono);
            setIdentificacion(clienteEditando.identificacion);
        }
    }, [clienteEditando]);

    const manejarSubmit = (e) => {
        e.preventDefault();

        // 1. Validar campos obligatorios
        if (nombre.trim() === "" || identificacion.trim() === "") {
            setError("El nombre y el número de identificación son obligatorios.");
            return;
        }

        // 2. Validar formato de correo básico con una expresión regular sencilla
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo.trim() !== "" && !regexCorreo.test(correo)) {
            setError("Por favor, ingrese un correo electrónico válido.");
            return;
        }

        // 3. Validar Identificación única
        const idDuplicado = clientes.find(
            (c) => c.identificacion === identificacion && c.id !== (clienteEditando ? clienteEditando.id : null)
        );

        if (idDuplicado) {
            setError("Ya existe un cliente registrado con ese número de identificación.");
            return;
        }

        setError(""); 

        const nuevoCliente = {
            id: clienteEditando ? clienteEditando.id : Date.now(),
            nombre, apellido, correo, telefono, identificacion
        };

        let nuevaLista;
        if (clienteEditando) {
            nuevaLista = clientes.map((c) => c.id === nuevoCliente.id ? nuevoCliente : c);
            setClienteEditando(null);
        } else {
            nuevaLista = [...clientes, nuevoCliente];
        }

        setClientes(nuevaLista);
        localStorage.setItem("clientes_biblioteca", JSON.stringify(nuevaLista));

        // Limpiar formulario
        setNombre(""); setApellido(""); setCorreo(""); setTelefono(""); setIdentificacion("");
    };

    const eliminarCliente = (id) => {
        const confirmacion = window.confirm("¿Seguro que deseas eliminar este cliente?");
        if(confirmacion) {
            const nuevaLista = clientes.filter((c) => c.id !== id);
            setClientes(nuevaLista);
            localStorage.setItem("clientes_biblioteca", JSON.stringify(nuevaLista));
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "white", textAlign: "center" }}>Gestión de Usuarios (Clientes)</h2>
            
            <div className="contenedor" style={{ marginTop: "20px" }}>
                <h3 style={{ textAlign: "center", color: "#2a5298" }}>
                    {clienteEditando ? "Editar Cliente" : "Registrar Nuevo Cliente"}
                </h3>
                {error && <p className="mensaje-error">{error}</p>}
                
                <form className="formulario" onSubmit={manejarSubmit}>
                    <input type="text" placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    <input type="text" placeholder="Número de Identificación (Ej. DPI) *" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
                    <input type="email" placeholder="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                    
                    <button type="submit" style={{ backgroundColor: clienteEditando ? "#12cccc" : "" }}>
                        {clienteEditando ? "Actualizar Cliente" : "Guardar Cliente"}
                    </button>
                    {clienteEditando && (
                        <button type="button" style={{ backgroundColor: "#6c757d" }} onClick={() => setClienteEditando(null)}>
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>

            <div className="contenedor" style={{ maxWidth: "800px" }}>
                <h3 style={{ color: "#2a5298" }}>Directorio de Clientes ({clientes.length})</h3>
                {clientes.length === 0 ? (
                    <p>No hay clientes registrados.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {clientes.map((cliente) => (
                            <li key={cliente.id} style={{ backgroundColor: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{cliente.nombre} {cliente.apellido}</strong>
                                    <br />
                                    <small>ID: {cliente.identificacion} | Tel: {cliente.telefono} | Correo: {cliente.correo}</small>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setClienteEditando(cliente)} style={{ backgroundColor: "#f5a623", padding: "8px" }}>Editar</button>
                                    <button onClick={() => eliminarCliente(cliente.id)} style={{ backgroundColor: "#ef4444", padding: "8px" }}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ModuloUsuarios;