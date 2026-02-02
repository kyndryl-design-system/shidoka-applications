import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';
import '../../components/reusable/modal';
import '../../components/ai/onboardModal';

export default {
  title: 'AI/Patterns/Onboard Content',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/9Q2XfTSxfzTXfNe2Bi8KDS/Component-Viewer?node-id=7-300058&p=f&m=dev',
    },
  },
};

// Single slide - automatically hides pagination, shows "Get Started" button
export const SingleSlide = {
  render: () => {
    return html`
      <kyn-chat-onboard-content
        title-text="Welcome to Bridge AI Assist"
        total-slides="1"
        @on-complete=${() => alert('Welcome! Getting started...')}
      >
        <p>
          AI Assist is built for accuracy and relevance. Unlike general AI
          tools, it uses a
          <strong
            >curated knowledge set tailored to specific use cases and
            personas</strong
          >, with access to
          <strong>selected internal sources and tools</strong>.
        </p>
        <p>Click "Get Started" to begin your AI journey!</p>
      </kyn-chat-onboard-content>
    `;
  },
};

// Multi-slide with navigation buttons (default behavior)
export const MultiSlideWithButtons = {
  args: {
    currentSlide: 0,
  },
  render: () => {
    const [{ currentSlide }, updateArgs] = useArgs();

    const handleSlideChange = (e) => {
      updateArgs({ currentSlide: e.detail.currentSlide });
    };

    const slides = [
      {
        title: 'Welcome to Bridge AI Assist',
        content: html`
          <p>AI Assist helps you get more done with your data.</p>
          <p>Use the navigation buttons to explore features.</p>
        `,
      },
      {
        title: 'Ask Questions About Your Data',
        content: html`
          <p>Simply type your question in natural language.</p>
          <p>AI Assist searches through your connected data sources.</p>
        `,
      },
      {
        title: 'Ready to Get Started!',
        content: html`
          <p>You're all set! Start exploring what AI can do for you.</p>
        `,
      },
    ];

    return html`
      <kyn-chat-onboard-content
        title-text="${slides[currentSlide].title}"
        total-slides="3"
        current-slide="${currentSlide}"
        @on-slide-change=${handleSlideChange}
        @on-complete=${() => alert('Onboarding complete!')}
      >
        ${slides[currentSlide].content}
      </kyn-chat-onboard-content>
    `;
  },
};

// Clickable pagination bullets (no navigation buttons)
export const ClickablePagination = {
  args: {
    currentSlide: 0,
  },
  render: () => {
    const [{ currentSlide }, updateArgs] = useArgs();

    const handleSlideChange = (e) => {
      updateArgs({ currentSlide: e.detail.currentSlide });
    };

    const slides = [
      {
        title: 'Step 1: Connect Your Data',
        content: html`
          <p>First, connect your data sources.</p>
          <p>Click the pagination dots below to navigate.</p>
        `,
      },
      {
        title: 'Step 2: Ask Questions',
        content: html`
          <p>Now you can ask questions about your data.</p>
          <p>The pagination bullets are clickable!</p>
        `,
      },
      {
        title: 'Step 3: Get Insights',
        content: html`
          <p>Receive AI-powered insights and answers.</p>
          <p>Complete the onboarding when ready.</p>
        `,
      },
    ];

    return html`
      <kyn-chat-onboard-content
        title-text="${slides[currentSlide].title}"
        total-slides="3"
        current-slide="${currentSlide}"
        hide-navigation
        @on-slide-change=${handleSlideChange}
        @on-complete=${() => alert('Onboarding complete!')}
      >
        ${slides[currentSlide].content}
      </kyn-chat-onboard-content>
    `;
  },
};

// No indicators at all - clean, minimal look
export const NoIndicators = {
  render: () => {
    return html`
      <kyn-chat-onboard-content
        title-text="Clean Onboarding Experience"
        total-slides="2"
        hide-indicators
      >
        <p>This onboarding has no pagination indicators for a cleaner look.</p>
        <p>Perfect for simple, distraction-free experiences.</p>
      </kyn-chat-onboard-content>
    `;
  },
};

// Custom button styling
export const CustomButtons = {
  render: () => {
    return html`
      <kyn-chat-onboard-content
        title-text="Custom Button Styles"
        total-slides="2"
        back-text="Go Back"
        next-text="Proceed"
        back-button-kind="secondary"
        next-button-kind="primary"
        back-button-size="large"
        next-button-size="large"
      >
        <p>Customize button text, kinds, and sizes to match your design.</p>
        <ul>
          <li>Custom button labels</li>
          <li>Different button kinds (primary, secondary, etc.)</li>
          <li>Various button sizes</li>
        </ul>
      </kyn-chat-onboard-content>
    `;
  },
};

// Fixed dimensions
export const FixedDimensions = {
  render: () => {
    return html`
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <kyn-modal
          open
          titleText="Welcome to AI Chat"
          okText="Get Started"
          cancelText="Skip"
          aiConnected
        >
          <kyn-chat-onboard-content
            title-text="Fixed Width & Height"
            total-slides="2"
            width="300px"
            height="400px"
          >
            <p>
              This component has fixed dimensions: 300px width and 400px height.
            </p>
            <p>Useful for consistent sizing in modals or cards.</p>
          </kyn-chat-onboard-content>
        </kyn-modal>
      </div>
    `;
  },
};
