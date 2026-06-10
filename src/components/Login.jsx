import { useState } from "react";

function Login({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const manejarSubmit = (e) => {
        e.preventDefault();

        if (correo.trim() === "" || password.trim() === "") {
            setError("Todos los campos son obligatorios");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios_biblioteca")) || [];
        
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo === correo && u.password === password
        );

        if (usuarioEncontrado) {
            setError("");
            onLogin(usuarioEncontrado); 
        } else {
            setError("Correo o contraseña incorrectos");
        }
    };

    return (
        <div className="contenedor">
            <h2>Biblioteca Buena Ventura</h2>
            {error && <p className="mensaje-error">{error}</p>}
            
            <form className="formulario" onSubmit={manejarSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;