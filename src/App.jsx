import { useState, useEffect } from "react";
import Login from "./components/Login";
import ModuloLibros from "./components/ModuloLibros";
import "./App.css";
import ModuloUsuarios from "./components/ModuloUsuarios";

function App() {
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [vistaActiva, setVistaActiva] = useState("inicio"); // Controla qué pantalla vemos

    useEffect(() => {
        if (!localStorage.getItem("usuarios_biblioteca")) {
            const usuariosIniciales = [
                { id: 1, nombre: "Admin", correo: "admin@upana.edu", password: "123", rol: "Administrador", identificacion: "ADMIN01" },
                { id: 2, nombre: "Gestor", correo: "gestor@upana.edu", password: "123", rol: "Gestor", identificacion: "GEST01" }
            ];
            localStorage.setItem("usuarios_biblioteca", JSON.stringify(usuariosIniciales));
        }

        const sesion = localStorage.getItem("sesion_activa");
        if (sesion) {
            setUsuarioActivo(JSON.parse(sesion));
        }
    }, []);

    const iniciarSesion = (usuario) => {
        setUsuarioActivo(usuario);
        localStorage.setItem("sesion_activa", JSON.stringify(usuario));
        setVistaActiva("inicio");
    };

    const cerrarSesion = () => {
        setUsuarioActivo(null);
        localStorage.removeItem("sesion_activa");
    };

    return (
        <div>
            {!usuarioActivo ? (
                <Login onLogin={iniciarSesion} />
            ) : (
                <div>
                    {/* Barra de navegación superior */}
                    <nav style={{ backgroundColor: "#1e293b", padding: "15px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0, color: "white" }}>Buena Ventura</h2>
                        <div style={{ display: "flex", gap: "15px" }}>
                            <button onClick={() => setVistaActiva("inicio")} style={{ background: "transparent", border: "none", color: vistaActiva === "inicio" ? "#12cccc" : "white", cursor: "pointer", fontWeight: "bold" }}>Inicio</button>
                            <button onClick={() => setVistaActiva("libros")} style={{ background: "transparent", border: "none", color: vistaActiva === "libros" ? "#12cccc" : "white", cursor: "pointer", fontWeight: "bold" }}>Libros</button>
                            {<button>Usuarios</button>}
                            {/* <button>Préstamos</button> */}
                        </div>
                        <div>
                            <span style={{ marginRight: "15px" }}>👤 {usuarioActivo.nombre} ({usuarioActivo.rol})</span>
                            <button onClick={cerrarSesion} style={{ padding: "5px 10px", backgroundColor: "#ef4444" }}>Salir</button>
                        </div>
                    </nav>

                    {/* Contenido de la pantalla */}
                    {vistaActiva === "inicio" && (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
                            <h1>Bienvenido al Sistema, {usuarioActivo.nombre}</h1>
                            <p>Utiliza el menú superior para navegar por los módulos.</p>
                        </div>
                    )}

                    {vistaActiva === "libros" && <ModuloLibros />}
                    {vistaActiva === "usuarios" && <ModuloUsuarios />}
                    
                </div>
            )}
        </div>
    );
}

export default App;