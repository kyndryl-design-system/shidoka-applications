import { html, unsafeCSS } from 'lit';

import './splitViewPattern';
import './splitViewCodeRail';
import splitViewStoryCss from './splitViewStory.scss?inline';

export const splitViewStoryStyles = html`<style>
  ${unsafeCSS(splitViewStoryCss)}
</style>`;
