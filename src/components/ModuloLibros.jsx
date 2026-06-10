import { useState, useEffect } from "react";

function ModuloLibros() {
    const [libros, setLibros] = useState([]);
    const [libroEditando, setLibroEditando] = useState(null);
    const [error, setError] = useState("");

    // Estados del formulario
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [editorial, setEditorial] = useState("");
    const [anio, setAnio] = useState("");
    const [isbn, setIsbn] = useState("");
    const [cantidad, setCantidad] = useState("");

    useEffect(() => {
        const datosGuardados = localStorage.getItem("libros_biblioteca");
        if (datosGuardados) {
            setLibros(JSON.parse(datosGuardados));
        } else {
            // Inyectamos algunos libros base usando tu estructura de Biblioteca.json
            const librosBase = [
                { id: 101, titulo: "Breve historia del tiempo", autor: "Stephen Hawking", editorial: "Bantam Books", anio: "1988", isbn: "978-0553380163", cantidad: 5 },
                { id: 102, titulo: "El señor presidente", autor: "Miguel Angel Asturias", editorial: "Losada", anio: "1946", isbn: "978-8437602513", cantidad: 3 }
            ];
            setLibros(librosBase);
            localStorage.setItem("libros_biblioteca", JSON.stringify(librosBase));
        }
    }, []);

    // Llenar el formulario si vamos a editar
    useEffect(() => {
        if (libroEditando) {
            setTitulo(libroEditando.titulo);
            setAutor(libroEditando.autor);
            setEditorial(libroEditando.editorial);
            setAnio(libroEditando.anio);
            setIsbn(libroEditando.isbn);
            setCantidad(libroEditando.cantidad);
        }
    }, [libroEditando]);

    const manejarSubmit = (e) => {
        e.preventDefault();

        // Reglas de negocio del PDF
        if (titulo.trim() === "" || autor.trim() === "" || isbn.trim() === "") {
            setError("El título, autor e ISBN son obligatorios.");
            return;
        }

        if (Number(cantidad) < 0) {
            setError("La cantidad disponible no puede ser negativa.");
            return;
        }

        // Validar ISBN duplicado
        const isbnDuplicado = libros.find(
            (l) => l.isbn === isbn && l.id !== (libroEditando ? libroEditando.id : null)
        );

        if (isbnDuplicado) {
            setError("Ya existe un libro registrado con este ISBN.");
            return;
        }

        setError(""); // Limpiamos errores si todo está bien

        const nuevoLibro = {
            id: libroEditando ? libroEditando.id : Date.now(),
            titulo, autor, editorial, anio, isbn, cantidad: Number(cantidad)
        };

        let nuevaLista;
        if (libroEditando) {
            nuevaLista = libros.map((l) => l.id === nuevoLibro.id ? nuevoLibro : l);
            setLibroEditando(null);
        } else {
            nuevaLista = [...libros, nuevoLibro];
        }

        setLibros(nuevaLista);
        localStorage.setItem("libros_biblioteca", JSON.stringify(nuevaLista));

        // Limpiar formulario
        setTitulo(""); setAutor(""); setEditorial(""); setAnio(""); setIsbn(""); setCantidad("");
    };

    const eliminarLibro = (id) => {
        const confirmacion = window.confirm("¿Seguro que deseas eliminar este libro?");
        if(confirmacion) {
            const nuevaLista = libros.filter((l) => l.id !== id);
            setLibros(nuevaLista);
            localStorage.setItem("libros_biblioteca", JSON.stringify(nuevaLista));
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "white", textAlign: "center" }}>Gestión de Libros</h2>
            
            <div className="contenedor" style={{ marginTop: "20px" }}>
                <h3 style={{ textAlign: "center", color: "#2a5298" }}>
                    {libroEditando ? "Editar Libro" : "Registrar Nuevo Libro"}
                </h3>
                {error && <p className="mensaje-error">{error}</p>}
                
                <form className="formulario" onSubmit={manejarSubmit}>
                    <input type="text" placeholder="Título *" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    <input type="text" placeholder="Autor *" value={autor} onChange={(e) => setAutor(e.target.value)} />
                    <input type="text" placeholder="ISBN *" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                    <input type="text" placeholder="Editorial" value={editorial} onChange={(e) => setEditorial(e.target.value)} />
                    <input type="number" placeholder="Año de Publicación" value={anio} onChange={(e) => setAnio(e.target.value)} />
                    <input type="number" placeholder="Cantidad Disponible *" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                    
                    <button type="submit" style={{ backgroundColor: libroEditando ? "#12cccc" : "" }}>
                        {libroEditando ? "Actualizar Libro" : "Guardar Libro"}
                    </button>
                    {libroEditando && (
                        <button type="button" style={{ backgroundColor: "#6c757d" }} onClick={() => setLibroEditando(null)}>
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>

            <div className="contenedor" style={{ maxWidth: "800px" }}>
                <h3 style={{ color: "#2a5298" }}>Catálogo de Libros ({libros.length})</h3>
                {libros.length === 0 ? (
                    <p>No hay libros registrados en la biblioteca.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {libros.map((libro) => (
                            <li key={libro.id} style={{ backgroundColor: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{libro.titulo}</strong> ({libro.anio}) - <em>{libro.autor}</em>
                                    <br />
                                    <small>ISBN: {libro.isbn} | Cantidad: {libro.cantidad}</small>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setLibroEditando(libro)} style={{ backgroundColor: "#f5a623", padding: "8px" }}>Editar</button>
                                    <button onClick={() => eliminarLibro(libro.id)} style={{ backgroundColor: "#ef4444", padding: "8px" }}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ModuloLibros;