import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { NotesApp } from "./NotesApp";

class NotesElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["data-idmateria"];
  }

  connectedCallback() {
    this.mountPoint = document.createElement("div");
    this.appendChild(this.mountPoint);
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    if (!this.mountPoint) return;

    const idMateriaAttr = this.getAttribute("data-idmateria");
    const idMateria = idMateriaAttr ? Number(idMateriaAttr) : null;

    console.log("🟢 React recibe idMateria:", idMateria);

    if (!this.root) {
      this.root = createRoot(this.mountPoint);
    }

    this.root.render(
      <React.StrictMode>
        <NotesApp idMateria={idMateria} />
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}

customElements.define("notes-app", NotesElement);
