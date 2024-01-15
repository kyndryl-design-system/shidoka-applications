import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './index';

/**
 * Test Dd.
 */
@customElement('kyn-test-dd')
export class TestDd extends LitElement {
  @property({ type: Array })
  items = [
    {
      value: 'all',
      text: 'All',
    },
    {
      value: 'option1',
      text: 'Option 1',
    },
    {
      value: 'option2',
      text: 'Option 2',
    },
    {
      value: 'option3',
      text: 'Option 3',
    },
    {
      value: 'option4',
      text: 'Option 4',
    },
  ];

  override render() {
    return html`
      <kyn-dropdown
        multiple
        name="testdd"
        @on-change=${(e: any) => {
          this.handleChange(e);
        }}
      >
        <span slot="label">All Option Example</span>

        ${this.items.map((item) => {
          // console.log(item);
          return html`
            <kyn-dropdown-option
              value=${item.value}
              ?selected=${item.selected}
              ?disabled=${item.disabled}
              @on-click=${(e: any) => {
                this.handleClick(e);
              }}
            >
              ${item.text}
            </kyn-dropdown-option>
          `;
        })}
      </kyn-dropdown>
    `;
  }

  handleClick(e: any) {
    console.log('on-click', e.detail);

    // check for 'all' option change
    if (e.detail.value === 'all') {
      // update all options to match 'all' option
      this.items.forEach((item) => {
        item.selected = e.detail.selected;
      });

      // force items prop to detect a change by cloning
      this.items = JSON.parse(JSON.stringify(this.items));
    }
  }

  override updated(changedProps: any) {
    if (changedProps.has('items')) {
      // reset kyn-dropdown value
      this.shadowRoot?.querySelector('kyn-dropdown')?.resetSelection();
    }
  }

  handleChange(e: any) {
    console.log('on-change', e.detail);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kyn-test-dd': TestDd;
  }
}
