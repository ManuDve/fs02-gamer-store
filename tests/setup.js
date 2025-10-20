import "@testing-library/jest-dom";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpiar después de cada test (cleanup DOM)
afterEach(() => {
  cleanup();
});

// Limpiar localStorage antes de cada test para aislar el estado
beforeEach(() => {
  localStorage.clear();
});