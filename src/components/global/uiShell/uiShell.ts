import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import UiShellScss from './uiShell.scss';

/**
 * Container to help with positioning and padding of the global elements such as: adds padding for the fixed Header, adds main content gutters, and makes Footer sticky. This takes the onus off of the consuming app to configure these values. TO DO: Update to work with dynamic/collapsible Side Nav.
 * @slot unnamed - Slot for global elements.
 */
@customElement('kyn-ui-shell')
export class UiShell extends LitElement {
  static override styles = UiShellScss;

  override render() {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-ui-shell': UiShell;
  }
}
