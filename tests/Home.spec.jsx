import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../src/pages/Home";

describe("Componente Home", () => {
  it("renderiza el título correctamente", () => {
    render(<Home />);
    expect(screen.getByText("Titulo del sitio")).toBeInTheDocument();
  });
  it("contiene un párrafo descriptivo", () => {
    render(<Home />);
    expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
  });
  it('renderiza el botón "Validar"', () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /validar/i })
    ).toBeInTheDocument();
  });
  it("muestra mensaje al hacer clic en Validar", () => {
    render(<Home />);
    const boton = screen.getByRole("button", { name: /validar/i });
    fireEvent.click(boton);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Validado correctamente"
    );
  });
});
