import './aiInputQuery';

if (!customElements.get('ai-input-query')) {
  customElements.define(
    'ai-input-query',
    customElements.get('kyn-ai-input-query')!
  );
}
