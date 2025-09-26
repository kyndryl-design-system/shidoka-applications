import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './spinner';

/**
 * Inline Loader.
 * @fires on-start - Emits when the loader been started. `detail: null`
 * @fires on-stop - Emits when the loader has been stopped and all animations have completed. `detail: null`
 * @slot unnamed - Slot for text/description.
 */
@customElement('kyn-loader-inline')
export class LoaderInline extends LitElement {
  /** Status. Can be `active`, `inactive`, `success`, `error`. */
  @property({ type: String })
  accessor status = 'active';

  override render() {
    return html`
      <kyn-spinner variant="inline" .status=${this.status}>
        <slot></slot>
      </kyn-spinner>
    `;
  }

  override firstUpdated() {
    const child = this.renderRoot.querySelector('kyn-spinner');
    if (!child) return;

    const forward = (evt: Event) => {
      this.dispatchEvent(new CustomEvent((evt as CustomEvent).type));
    };

    child.addEventListener('on-start', forward as EventListener);
    child.addEventListener('on-stop', forward as EventListener);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-loader-inline': LoaderInline;
  }
}
