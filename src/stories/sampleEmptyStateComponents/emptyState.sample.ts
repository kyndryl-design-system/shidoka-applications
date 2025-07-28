import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../../components/reusable/button';
import '../../components/reusable/link';

import emptyStateScss from './sampleEmptyState.scss?inline';

/**  Empty State Sample component -- sample Lit component to show vital card pattern. */
@customElement('empty-state-sample-component')
export class EmptyStateSampleComponent extends LitElement {
  static override styles = unsafeCSS(emptyStateScss);

  /** Empty state size. */
  @property({ type: String })
  accessor size: 'small' | 'medium' | 'large' = 'medium';

  /** Track if slots have title content
   * @internal
   */
  @state()
  private accessor hasTitle = false;

  /** Track if slots have description content
   * @internal
   */
  @state()
  private accessor hasDescription = false;

  /** Track if slots have action buttons and/or links
   * @internal
   */
  @state()
  private accessor hasActions = false;

  override render() {
    const classes = classMap({
      'empty-state--wrapper': true,
      'empty-state--small': this.size === 'small',
      'empty-state--medium': this.size === 'medium',
      'empty-state--large': this.size === 'large',
    });
    return html`
      <div class=${classes}>
        <div class="empty-state--icon-wrapper">
          <slot name="icon"></slot>
        </div>
        <div class="empty-state--content">
          <div class="empty-state-content-wrapper">
            <div
              class="empty-state--title-div"
              style=${this.size !== 'small' && this.hasTitle
                ? ''
                : 'display: none;'}
            >
              <h1>
                <slot name="title" @slotchange=${this.handleSlotChange}></slot>
              </h1>
            </div>
            <div
              class="empty-state--description-text"
              style=${this.hasDescription ? '' : 'display: none;'}
            >
              <p>
                <slot
                  name="description"
                  @slotchange=${this.handleSlotChange}
                ></slot>
              </p>
            </div>
          </div>
          <div
            class="empty-state--action-wrapper"
            style=${this.hasActions ? '' : 'display: none;'}
          >
            <slot name="actions" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
      </div>
    `;
  }

  private handleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const slotName = slot.name;
    const hasContent = slot.assignedNodes().length > 0;

    switch (slotName) {
      case 'title':
        this.hasTitle = hasContent;
        break;
      case 'description':
        this.hasDescription = hasContent;
        break;
      case 'actions':
        this.hasActions = hasContent;
        break;
    }
  }

  private checkSlotContent() {
    const titleSlot = this.shadowRoot?.querySelector(
      'slot[name="title"]'
    ) as HTMLSlotElement;
    const descriptionSlot = this.shadowRoot?.querySelector(
      'slot[name="description"]'
    ) as HTMLSlotElement;
    const actionsSlot = this.shadowRoot?.querySelector(
      'slot[name="actions"]'
    ) as HTMLSlotElement;

    if (titleSlot) {
      this.hasTitle = titleSlot.assignedNodes().length > 0;
    }
    if (descriptionSlot) {
      this.hasDescription = descriptionSlot.assignedNodes().length > 0;
    }
    if (actionsSlot) {
      this.hasActions = actionsSlot.assignedNodes().length > 0;
    }
  }

  override firstUpdated() {
    setTimeout(() => {
      this.checkSlotContent();
    });

    const iconSlot = this.shadowRoot?.querySelector(
      'slot[name="icon"]'
    ) as HTMLSlotElement | null;

    const patchSVG = () => {
      const nodes = iconSlot?.assignedNodes({ flatten: true }) ?? [];
      for (const node of nodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
          const svg = (node as HTMLElement).querySelector('svg');
          if (svg) {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
          }
        }
      }
    };

    iconSlot?.addEventListener('slotchange', patchSVG);
    patchSVG();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'empty-state-sample-component': EmptyStateSampleComponent;
  }
}
