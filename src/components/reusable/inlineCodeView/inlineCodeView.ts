import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';

import InlineCodeViewStyles from './inlineCodeView.scss';

/**
 * `<kyn-inline-code-view>` component to display code snippets inline within HTML content.
 * @slot unnamed - inline code snippet slot.
 */
@customElement('kyn-inline-code-view')
export class InlineCodeView extends LitElement {
  static override styles = InlineCodeViewStyles;

  /** `aria-label` attribute value for accessibility purposes. */
  @property({ type: String, attribute: 'aria-label' })
  ariaLabelAttr = '';

  @query('slot')
  private slotElement!: HTMLSlotElement;

  override render() {
    return html`
      <code>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </code>
    `;
  }

  private handleSlotChange() {
    const slottedElements = this.slotElement.assignedElements();
    slottedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.setAttribute('aria-label', this.ariaLabelAttr);
      }
    });
  }

  protected override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('ariaLabelAttr')) {
      this.handleSlotChange();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-inline-code-view': InlineCodeView;
  }
}
