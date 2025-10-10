import { useState } from "react";
function Home() {
  const [mensaje, setMensaje] = useState("");
  const validar = () => {
    setMensaje("Validado correctamente");
  };
  return (
    <>
      <main>
        <h1>Titulo del sitio</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          iure fugiat mollitia saepe cupiditate nisi, deserunt soluta.
        </p>
      </main>
      <button onClick={validar}>Validar</button>
      {mensaje && <p role="status">{mensaje}</p>}
    </>
  );
}
export default Home;
