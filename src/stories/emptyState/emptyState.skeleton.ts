import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './emptyState.scss';

/**
 * Empty State Pattern
 */
export interface EmptyStateConfig {
  /** Icon element or HTML to display */
  icon?: unknown;
  /** Optional heading text */
  title?: string;
  /** Main explanatory text */
  description?: string;
  /** Action buttons or links */
  actions?: unknown;
  /** Size variant of the empty state */
  size?: 'small' | 'large';
  /** Custom maximum width (CSS value) */
  maxWidth?: string;
  /** Additional CSS classes */
  classes?: string;
  /** ARIA role for accessibility */
  role?: 'status' | 'alert';
  /** ARIA live region setting */
  ariaLive?: 'polite' | 'assertive';
}

export const EmptyStateDefaults: Partial<EmptyStateConfig> = {
  size: 'large',
  role: 'status',
  ariaLive: 'polite',
};

export const EmptyStateSkeleton = (config: EmptyStateConfig) => {
  const finalConfig = { ...EmptyStateDefaults, ...config };
  const {
    icon,
    title,
    description,
    actions,
    size,
    maxWidth,
    classes,
    role,
    ariaLive,
  } = finalConfig;

  return html`
    <div
      class="empty-state--wrapper empty-state--${size} ${classes || ''}"
      style="${maxWidth ? `--empty-state-max-width: ${maxWidth};` : ''}"
      role="${ifDefined(role)}"
      aria-live="${ifDefined(ariaLive)}"
    >
      <div class="empty-state--icon-wrapper">${icon ?? ''}</div>
      <div class="empty-state--content">
        <div class="empty-state-content-wrapper">
          ${title
            ? html`
                <div class="empty-state--title-div">
                  <h1>${title}</h1>
                </div>
              `
            : ''}
          ${description
            ? html`
                <div class="empty-state--description-text">
                  <p>${description}</p>
                </div>
              `
            : ''}
        </div>
        ${actions
          ? html` <div class="empty-state--action-wrapper">${actions}</div> `
          : ''}
      </div>
    </div>
  `;
};

export const LargeNoDataEmptyState = (config: Partial<EmptyStateConfig>) =>
  EmptyStateSkeleton({
    size: 'large',
    role: 'status',
    ...config,
  });

export const LargeNoSearchResultsEmptyState = (
  config: Partial<EmptyStateConfig>
) =>
  EmptyStateSkeleton({
    size: 'large',
    role: 'status',
    ...config,
  });

export const LargeDataVisualizationEmptyState = (
  config: Partial<EmptyStateConfig>
) =>
  EmptyStateSkeleton({
    size: 'large',
    role: 'status',
    ...config,
  });

export const SmallWidgetEmptyState = (config: Partial<EmptyStateConfig>) =>
  EmptyStateSkeleton({
    size: 'small',
    role: 'status',
    ...config,
  });

export const SmallDataVisualizationEmptyState = (
  config: Partial<EmptyStateConfig>
) =>
  EmptyStateSkeleton({
    size: 'small',
    role: 'status',
    ...config,
  });
