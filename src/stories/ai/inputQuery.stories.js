import { html } from 'lit';
import { action } from 'storybook/actions';
import '../../components/reusable/textArea';
import '../../components/reusable/button';
import sendIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/send.svg';
import stopIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/control-stop-filled.svg';
import analyticsIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/analytics.svg';
import customerEngagementIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/customer-engagement.svg';
import databaseIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/database.svg';
import flowDataIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/flow-data.svg';
import plusIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/add-simple.svg';
import downIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/20/chevron-down.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '../../components/reusable/notification';
import '../../components/reusable/dropdown';
import '../../components/reusable/tag';

export default {
  title: 'AI/Patterns/Input Query',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300057&p=f&m=dev',
    },
  },
};

const setBool = (el, key, val) =>
  val ? el.setAttribute(key, 'true') : el.removeAttribute(key);

const onPointer = (e) => (e.currentTarget.dataset.modality = 'pointer');
const onKeyDown = (e) => (e.currentTarget.dataset.modality = 'keyboard');

export const Default = {
  args: { floating: false },
  render: (args) => {
    return html`
      <form
        class="ai-input-query query-footer ${args.floating ? 'floating' : ''}"
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
        @pointerdown=${onPointer}
        @keydown=${onKeyDown}
      >
        <div class="message-content">
          <div class="textarea-container" tabindex="-1">
            <kyn-text-area
              name="ai-query"
              rows="2"
              placeholder="Type your message..."
              maxRowsVisible="3"
              label="AI Prompt Query"
              hideLabel
              aiConnected
              hideBorder
              notResizeable
            ></kyn-text-area>
          </div>

          <kyn-button type="submit" kind="primary-ai" description="Submit">
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
        </div>
      </form>

      ${sharedStyles}
    `;
  },
};

export const Thinking = {
  args: { floating: false },
  render: (args) => {
    return html`
      <form
        class="ai-input-query query-footer ${args.floating ? 'floating' : ''}"
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
        @pointerdown=${onPointer}
        @keydown=${onKeyDown}
      >
        <div class="message-content">
          <div class="textarea-container">
            <kyn-text-area
              name="ai-query"
              rows="2"
              placeholder="Type your message..."
              maxRowsVisible="3"
              label="AI Prompt Query"
              hideLabel
              aiConnected
              hideBorder
              notResizeable
            ></kyn-text-area>
          </div>

          <kyn-button type="submit" kind="primary-ai" description="Stop">
            <span slot="icon">${unsafeSVG(stopIcon)}</span>
          </kyn-button>
        </div>
      </form>

      ${sharedStyles}
    `;
  },
};

export const Footer = {
  args: {
    floating: false,
    firstDropDownValue: 'Option 1',
    secondDropDownValue: 'Option 1',
    firstDropDownIcon: databaseIcon,
    secondDropDownIcon: customerEngagementIcon,
  },
  parameters: { controls: { include: ['floating'] } },
  render: (args) => {
    const onEnter = (e) => setBool(e.currentTarget, 'data-hover', true);
    const onLeave = (e) => {
      const el = e.currentTarget;
      setBool(el, 'data-hover', false);
      setBool(el, 'data-active', false);
    };
    const onDown = (e) => {
      const el = e.currentTarget;
      el.dataset.modality = 'pointer';
      setBool(el, 'data-active', true);
    };
    const onUp = (e) => setBool(e.currentTarget, 'data-active', false);
    const onPointer = (e) => (e.currentTarget.dataset.modality = 'pointer');
    const onKeyDown = (e) => (e.currentTarget.dataset.modality = 'keyboard');
    const onFocusIn = (e) => {
      const el = e.currentTarget;
      const kb = el.dataset.modality === 'keyboard';
      setBool(el, 'data-focus-visible', kb);
    };
    const onFocusOut = (e) =>
      setBool(e.currentTarget, 'data-focus-visible', false);

    return html`
      <form
        class="ai-input-query query-footer ${args.floating ? 'floating' : ''}"
        @submit=${(e) => {
          e.preventDefault();
          action('submit')(e);
          const formData = new FormData(e.target);
          console.log(...formData);
        }}
        @pointerdown=${onPointer}
        @keydown=${onKeyDown}
      >
        <div class="message-content">
          <div
            class="textarea-container"
            @mouseenter=${onEnter}
            @mouseleave=${onLeave}
            @mousedown=${onDown}
            @mouseup=${onUp}
            @pointerdown=${onPointer}
            @keydown=${onKeyDown}
            @focusin=${onFocusIn}
            @focusout=${onFocusOut}
            tabindex="-1"
          >
            <kyn-text-area
              name="ai-query"
              rows="2"
              placeholder="Type your message..."
              maxRowsVisible="3"
              label="AI Prompt Query"
              hideLabel
              aiConnected
              hideBorder
              notResizeable
            ></kyn-text-area>

            <div class="footer-content">
              <input
                id="ai-file-input"
                type="file"
                name="ai-attachments"
                style="display: none;"
                @change=${(e) => action('files-selected')(e)}
              />

              <kyn-button
                type="button"
                kind="tertiary"
                size="small"
                iconPosition="right"
                description="Additional"
                @click=${() =>
                  document.getElementById('ai-file-input')?.click()}
              >
                <span slot="icon">${unsafeSVG(plusIcon)}</span>
              </kyn-button>

              <kyn-dropdown
                ?hideLabel=${true}
                .value=${args.firstDropDownValue}
                kind="ai"
                menuMinWidth="280px"
                @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
              >
                <kyn-button
                  slot="anchor"
                  type="button"
                  class="dropdown-anchor-button"
                  kind="tertiary"
                  size="small"
                >
                  <div
                    style="display:flex;align-items:center;justify-content:space-between;width:100%;"
                  >
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="display:inline-flex;"
                        >${unsafeSVG(args.firstDropDownIcon)}</span
                      >
                      <span>${args.firstDropDownValue}</span>
                    </div>
                    <span
                      style="display:inline-flex;align-items:center;height:100%; margin-left:8px;"
                    >
                      ${unsafeSVG(downIcon)}
                    </span>
                  </div>
                </kyn-button>

                <kyn-enhanced-dropdown-option value="Option 1">
                  <span slot="icon">${unsafeSVG(databaseIcon)}</span>
                  <span slot="title">Option 1</span>
                  <span slot="description">Description for the Option 1</span>
                </kyn-enhanced-dropdown-option>

                <kyn-enhanced-dropdown-option value="Option 2">
                  <span slot="icon">${unsafeSVG(analyticsIcon)}</span>
                  <span slot="title">Option 2</span>
                  <kyn-tag
                    slot="tag"
                    label="New chat"
                    tagSize="sm"
                    tagColor="ai"
                  ></kyn-tag>
                  <span slot="description">Description for the Option 2</span>
                </kyn-enhanced-dropdown-option>
              </kyn-dropdown>

              <kyn-dropdown
                ?hideLabel=${true}
                .value=${args.secondDropDownValue}
                kind="ai"
                menuMinWidth="280px"
                @on-change=${(e) => action(e.type)({ ...e, detail: e.detail })}
              >
                <kyn-button
                  slot="anchor"
                  type="button"
                  class="dropdown-anchor-button"
                  kind="tertiary"
                  size="small"
                >
                  <div
                    style="display:flex;align-items:center;justify-content:space-between;width:100%;"
                  >
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="display:inline-flex;"
                        >${unsafeSVG(args.secondDropDownIcon)}</span
                      >
                      <span>${args.secondDropDownValue}</span>
                    </div>
                    <span
                      style="display:inline-flex;align-items:center;height:100%; margin-left:8px;"
                    >
                      ${unsafeSVG(downIcon)}
                    </span>
                  </div>
                </kyn-button>

                <kyn-enhanced-dropdown-option value="Option 1">
                  <span slot="icon">${unsafeSVG(flowDataIcon)}</span>
                  <span slot="title">Option 1</span>
                  <span slot="description">Description for the Option 1</span>
                </kyn-enhanced-dropdown-option>

                <kyn-enhanced-dropdown-option value="Option 2">
                  <span slot="icon">${unsafeSVG(customerEngagementIcon)}</span>
                  <span slot="title">Option 2</span>
                  <kyn-tag
                    slot="tag"
                    label="New chat"
                    tagSize="sm"
                    tagColor="ai"
                  ></kyn-tag>
                  <span slot="description">Description for the Option 2</span>
                </kyn-enhanced-dropdown-option>
              </kyn-dropdown>
            </div>
          </div>

          <kyn-button type="submit" kind="primary-ai" description="Submit">
            <span slot="icon">${unsafeSVG(sendIcon)}</span>
          </kyn-button>
        </div>
      </form>

      ${sharedStyles}
    `;
  },
};

const sharedStyles = html`
  <style>
    .ai-input-query {
      margin-top: auto;
      display: flex;
      gap: 10px;
      padding: 10px;
      align-items: center;
      border-radius: 8px;
      background-color: var(--kd-color-background-container-ai-level-2);
      border: 1px solid transparent;
      box-shadow: none;
      width: 100%;
    }

    .ai-input-query.floating {
      border-color: transparent;
      box-shadow: var(--kd-elevation-level-3-ai);
    }

    .message-content {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
    }

    .message-content > kyn-button {
      align-self: center;
    }

    /* --- sharedStyles overrides: rely on :focus-within rather than dataset from focusin/out */
    .textarea-container:focus-within {
      border: 2px solid var(--kd-color-border-variants-focus);
    }

    /* If you still want keyboard-only focus ring, use the modality flag set on the <form>: */
    .ai-input-query[data-modality='keyboard'] .textarea-container:focus-within {
      border: 2px solid var(--kd-color-border-variants-focus);
    }

    /* Optional: suppress pointer “focus ring” if desired */
    .ai-input-query[data-modality='pointer'] .textarea-container:focus-within {
      border: 1px solid var(--kd-color-border-ui-default);
    }

    .textarea-container {
      display: flex;
      flex-direction: column;
      gap: 0;
      flex: 1 1 auto;
      min-width: 0;
      border-radius: 8px;
      background: var(--kd-color-background-forms-default);
      border: 1px solid var(--kd-color-border-ui-default);
      position: relative;
      overflow: visible;
      isolation: isolate;
      transition: background-color 150ms ease-out, border-color 150ms ease-out;
    }

    .textarea-container > kyn-text-area {
      flex: 1 1 auto;
      min-width: 0;
      border: 0;
      background: transparent;
      --kyn-text-area-border-color: transparent;
      --kyn-text-area-background: transparent;
      --kyn-text-area-box-shadow: none;
      --kyn-text-area-padding-inline: 0;
      padding: 8px 10px;
    }

    .textarea-container > kyn-text-area::part(control),
    .textarea-container > kyn-text-area::part(textarea),
    .textarea-container > kyn-text-area::part(root) {
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .textarea-container.with-footer {
      overflow: visible;
    }

    .textarea-container:hover {
      border: 1px solid transparent;
      border-radius: 8px;
      background: linear-gradient(
            var(--kd-color-background-container-ai-level-2),
            var(--kd-color-background-container-ai-level-2)
          )
          padding-box,
        linear-gradient(
            var(
              --kd-surface-backdrop,
              var(--kd-color-background-ui-hollow-default)
            ),
            var(
              --kd-surface-backdrop,
              var(--kd-color-background-ui-hollow-default)
            )
          )
          padding-box,
        var(
            --kd-gradient-border-ai-default,
            linear-gradient(
              to bottom,
              var(--kd-color-border-ai-default-gradient-start),
              var(--kd-color-border-ai-default-gradient-end)
            )
          )
          border-box;
      background-clip: padding-box, padding-box, border-box;
      background-origin: border-box, border-box, border-box;
      background-size: calc(100% + 2px) calc(100% + 2px),
        calc(100% + 2px) calc(100% + 2px), cover;
      background-position: center, center, center;
      background-repeat: no-repeat, no-repeat, no-repeat;
    }

    .textarea-container[data-focus-visible='true'],
    .textarea-container:focus-within[data-focus-visible='true'],
    .textarea-container:focus-visible {
      border: 2px solid var(--kd-color-border-variants-focus);
    }

    .textarea-container:active {
      background: var(--kd-color-background-forms-pressed);
      border: 2px solid var(--kd-color-border-variants-focus);
    }

    .footer-content {
      display: flex;
      padding: 6px 8px;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      align-self: stretch;
      background: transparent;
      position: relative;
      z-index: 1;
    }

    .dropdown-anchor-button {
      width: auto;
      justify-content: space-between;
    }
  </style>
`;
