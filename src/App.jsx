import { useState, useEffect } from "react";
import Login from "./components/Login";
import ModuloLibros from "./components/ModuloLibros";
import "./App.css";
import ModuloUsuarios from "./components/ModuloUsuarios";
import ModuloPrestamos from "./components/ModuloPrestamos";
import ModuloReportes from "./components/ModuloReportes";

function App() {
    // Guarda el usuario que tiene la sesión abierta (null si nadie ha entrado)
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    // Controla qué módulo se está mostrando en pantalla
    const [vistaActiva, setVistaActiva] = useState("inicio");

    useEffect(() => {
        // La primera vez que se abre la app creamos los usuarios del sistema
        // si todavía no existen en localStorage
        if (!localStorage.getItem("usuarios_biblioteca")) {
            const usuariosIniciales = [
                { id: 1, nombre: "Admin", correo: "admin@upana.edu", password: "123", rol: "Administrador", identificacion: "ADMIN01" },
                { id: 2, nombre: "Gestor", correo: "gestor@upana.edu", password: "123", rol: "Gestor", identificacion: "GEST01" }
            ];
            localStorage.setItem("usuarios_biblioteca", JSON.stringify(usuariosIniciales));
        }

        // Si había una sesión guardada la recuperamos para no pedir login de nuevo
        const sesion = localStorage.getItem("sesion_activa");
        if (sesion) {
            setUsuarioActivo(JSON.parse(sesion));
        }
    }, []);

    // Se llama desde el Login cuando las credenciales son correctas
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
            {/* Si no hay nadie con sesión mostramos el login, si no, el sistema */}
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
                            <button onClick={() => setVistaActiva("usuarios")} style={{ background: "transparent", border: "none", color: vistaActiva === "usuarios" ? "#12cccc" : "white", cursor: "pointer", fontWeight: "bold" }}>Usuarios</button>
                            <button onClick={() => setVistaActiva("prestamos")} style={{ background: "transparent", border: "none", color: vistaActiva === "prestamos" ? "#12cccc" : "white", cursor: "pointer", fontWeight: "bold" }}>Préstamos</button>
                            {/* La reportería solo aparece si el rol es Administrador */}
                            {usuarioActivo.rol === "Administrador" && (
                                <button onClick={() => setVistaActiva("reportes")} style={{ background: "transparent", border: "none", color: vistaActiva === "reportes" ? "#12cccc" : "white", cursor: "pointer", fontWeight: "bold" }}>Reportería</button>
                            )}
                        </div>
                        <div>
                            <span style={{ marginRight: "15px" }}>👤 {usuarioActivo.nombre} ({usuarioActivo.rol})</span>
                            <button onClick={cerrarSesion} style={{ padding: "5px 10px", backgroundColor: "#ef4444" }}>Salir</button>
                        </div>
                    </nav>

                    {/* Según la vista activa mostramos el módulo correspondiente */}
                    {vistaActiva === "inicio" && (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
                            <h1>Bienvenido al Sistema, {usuarioActivo.nombre}</h1>
                            <p>Utiliza el menú superior para navegar por los módulos.</p>
                        </div>
                    )}

                    {vistaActiva === "libros" && <ModuloLibros rolUsuario={usuarioActivo.rol} />}
                    {vistaActiva === "usuarios" && <ModuloUsuarios rolUsuario={usuarioActivo.rol} />}
                    {vistaActiva === "prestamos" && <ModuloPrestamos />}
                    {/* Doble protección: aunque se forzara la vista, sin rol Admin no se renderiza */}
                    {vistaActiva === "reportes" && usuarioActivo.rol === "Administrador" && <ModuloReportes />}

                </div>
            )}
        </div>
    );
}

export default App;