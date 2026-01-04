import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { RemindersApp } from "./RemindersApp";

class RemindersElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    this.mountPoint = document.createElement("div");
    this.appendChild(this.mountPoint);
    this.render();
  }

  render() {
    if (!this.mountPoint) return;

    if (!this.root) {
      this.root = createRoot(this.mountPoint);
    }

    this.root.render(
      <React.StrictMode>
        <RemindersApp />
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}

customElements.define("reminders-app", RemindersElement);
