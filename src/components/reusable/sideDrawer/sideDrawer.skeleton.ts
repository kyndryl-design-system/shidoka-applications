import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../loaders/skeleton';
import './sideDrawer';

/**
 * Side Drawer Skeleton Component.
 * Provides a loading state visual representation of the Side Drawer.
 * @slot anchor - Slot for the anchor button content.
 */
@customElement('kyn-side-drawer-skeleton')
export class SideDrawerSkeleton extends LitElement {
  /** Drawer open state. */
  @property({ type: Boolean })
  open = false;

  /** Drawer size. 'md', or 'sm'. */
  @property({ type: String })
  size = 'md';

  override render() {
    return html`
      <kyn-side-drawer
        ?open=${this.open}
        size=${this.size}
        titleText="Drawer Title"
        labelText="Label"
        submitBtnText="Ok"
        cancelBtnText="Cancel"
        ?submitBtnDisabled=${true}
        ?showSecondaryButton=${false}
        secondaryButtonText="Secondary"
      >
        <slot name="anchor" slot="anchor"></slot>
        ${Array.from(
          { length: 5 },
          () => html`
            <div style="margin-bottom: 16px">
              <kyn-skeleton inline width="100%"></kyn-skeleton>
            </div>
          `
        )}
      </kyn-side-drawer>
    `;
  }
}
