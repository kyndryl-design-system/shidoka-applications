import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../../components/reusable/loaders/skeleton';
import TabsSkeletonScss from '../../components/reusable/tabs/tabs.skeleton.scss';

/**
 * Tabs Skeleton.
 */
@customElement('kyn-tabs-skeleton')
export class TabsSkeleton extends LitElement {
  static override styles = TabsSkeletonScss;

  /** Size of the tab buttons, `'sm'` or `'md'`. */
  @property({ type: String })
  tabSize = 'md';

  /** Vertical orientation. */
  @property({ type: Boolean })
  vertical = false;

  /** Number of skeleton tabs to display. */
  @property({ type: Number })
  tabCount = 3;

  override render() {
    const wrapperClasses = {
      wrapper: true,
      vertical: this.vertical,
    };

    const tabsClasses = {
      tabs: true,
      contained: 'contained',
    };
    const tabClasses = {
      tab: true,
      contained: 'contained',
      'size--sm': this.tabSize === 'sm',
      'size--md': this.tabSize === 'md',
      vertical: this.vertical,
    };

    const skeletonTabs = Array.from(
      { length: this.tabCount },
      (_) => html`
        <div class=${classMap(tabClasses)}>
          <kyn-skeleton elementType="tabs" inline></kyn-skeleton>
        </div>
      `
    );

    return html`
      <div class=${classMap(wrapperClasses)}>
        <div class=${classMap(tabsClasses)} role="tablist">${skeletonTabs}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-tabs-skeleton': TabsSkeleton;
  }
}
