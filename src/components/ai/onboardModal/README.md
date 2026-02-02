## Key Features

### 🎯 **Smart Single-Slide Mode**

When `total-slides="1"`, automatically hides pagination and shows "Get Started" button.

### 🎮 **Flexible Navigation**

- With buttons: Standard back/next navigation
- Without buttons: Clickable pagination dots for mobile
- No navigation: Clean static display

### 🎨 **Rich Customization**

- Button styles and sizes
- Custom text and icons
- Show/hide any UI elements
- Fixed width/height support

### 📱 **Responsive & Accessible**

- Works on all screen sizes
- Keyboard navigation
- Screen reader friendly

## Component Name

`kyn-chat-onboard-content`

## Installation

```javascript
import '@kyndryl-design-system/shidoka-applications/components/ai/onboardModal';
```

## Quick Usage

### Single Slide

```html
<kyn-chat-onboard-content title-text="Welcome!">
  <p>Get started with our features...</p>
</kyn-chat-onboard-content>
```

### Multi-Slide with Navigation

```html
<kyn-chat-onboard-content
  title-text="Feature Tour"
  total-slides="3"
  current-slide="0"
  @on-slide-change="${handleSlide}"
  @on-complete="${handleComplete}"
>
  <p>Step content here...</p>
</kyn-chat-onboard-content>
```

### Fixed Dimensions

```html
<kyn-chat-onboard-content title-text="Fixed Size" width="400px" height="300px">
  <p>Exact dimensions</p>
</kyn-chat-onboard-content>
```

### Mobile-Friendly (Dots Only)

```html
<kyn-chat-onboard-content
  title-text="Mobile Guide"
  total-slides="3"
  hide-navigation
>
  <p>Tap dots to navigate...</p>
</kyn-chat-onboard-content>
```

## Properties

| Property         | Attribute          | Type      | Default      | Description                          |
| ---------------- | ------------------ | --------- | ------------ | ------------------------------------ |
| `titleText`      | `title-text`       | `string`  | `'Welcome!'` | Main title text                      |
| `totalSlides`    | `total-slides`     | `number`  | `1`          | Total number of slides               |
| `currentSlide`   | `current-slide`    | `number`  | `0`          | Current active slide (0-indexed)     |
| `backText`       | `back-text`        | `string`  | `'Back'`     | Back button label                    |
| `nextText`       | `next-text`        | `string`  | `'Next'`     | Next button label                    |
| `backButtonKind` | `back-button-kind` | `string`  | `'tertiary'` | Back button style                    |
| `nextButtonKind` | `next-button-kind` | `string`  | `'tertiary'` | Next button style                    |
| `backButtonSize` | `back-button-size` | `string`  | `'small'`    | Back button size                     |
| `nextButtonSize` | `next-button-size` | `string`  | `'small'`    | Next button size                     |
| `hideNavigation` | `hide-navigation`  | `boolean` | `false`      | Hide navigation buttons              |
| `hideIndicators` | `hide-indicators`  | `boolean` | `false`      | Hide pagination dots                 |
| `width`          | `width`            | `string`  | `''`         | Fixed width (e.g., '300px', '50%')   |
| `height`         | `height`           | `string`  | `''`         | Fixed height (e.g., '400px', '50vh') |

## Smart Behaviors

| Configuration            | Pagination | Navigation         | Clickable Dots |
| ------------------------ | ---------- | ------------------ | -------------- |
| `total-slides="1"`       | Hidden     | "Get Started" only | N/A            |
| `hide-navigation="true"` | Visible    | Hidden             | Yes            |
| Default (multi-slide)    | Visible    | Back + Next        | No             |

## Events

| Event             | Detail                     | Description           |
| ----------------- | -------------------------- | --------------------- |
| `on-slide-change` | `{ currentSlide: number }` | Slide changed         |
| `on-complete`     | -                          | Last slide completed  |
| `on-back`         | -                          | Back from first slide |

## Slots

| Slot      | Description                   |
| --------- | ----------------------------- |
| (default) | Slide content (supports HTML) |

## Complete Example

```javascript
import { html } from 'lit';
import '@kyndryl-design-system/shidoka-applications/components/ai/onboardModal';

class MyOnboarding {
  constructor() {
    this.currentSlide = 0;
  }

  handleSlideChange(e) {
    this.currentSlide = e.detail.currentSlide;
    this.render();
  }

  render() {
    return html`
      <kyn-chat-onboard-content
        title-text="Welcome!"
        total-slides="3"
        current-slide="${this.currentSlide}"
        @on-slide-change="${this.handleSlideChange}"
        @on-complete="${() => console.log('Done!')}"
      >
        <p>Slide ${this.currentSlide + 1} content...</p>
      </kyn-chat-onboard-content>
    `;
  }
}
```

## Button Customization

Available button kinds: `primary`, `secondary`, `tertiary`, `ghost`, `ghost-ai`
Available sizes: `small`, `medium`, `large`

```html
<kyn-chat-onboard-content
  next-button-kind="primary"
  next-button-size="large"
  back-button-kind="ghost"
>
  <p>Custom styled buttons</p>
</kyn-chat-onboard-content>
```

## Modal Usage

```html
<kyn-modal open>
  <kyn-chat-onboard-content title-text="Welcome" hide-navigation>
    <p>Content inside modal</p>
  </kyn-chat-onboard-content>
</kyn-modal>
```

## Styling & Accessibility

- Uses Shidoka design tokens
- Supports keyboard navigation
- Screen reader friendly
- Rich HTML content support

## Quick Reference

**Simple welcome**: `title-text` + content
**Tutorial**: `total-slides` + `current-slide` + event handlers
**Mobile**: `hide-navigation` for clickable dots
**Fixed size**: `width` + `height` attributes

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+

## Related Components

- `kyn-modal` - Modal container
- `kyn-button` - Navigation buttons
