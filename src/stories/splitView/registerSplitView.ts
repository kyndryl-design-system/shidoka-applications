import { html, unsafeCSS } from 'lit';

import { registerSplitViewPattern } from './splitViewPattern';
import { registerSplitViewCodeRail } from './splitViewCodeRail';
import splitViewPatternCss from './splitViewPattern.scss?inline';
import splitViewCodeRailCss from './splitViewCodeRail.scss?inline';
import splitViewBlockFlushCss from './splitViewBlockFlush.scss?inline';
import splitViewStoryCss from './splitViewStory.scss?inline';

registerSplitViewPattern(splitViewPatternCss);
registerSplitViewCodeRail(splitViewCodeRailCss, splitViewBlockFlushCss);

export const splitViewStoryStyles = html`<style>
  ${unsafeCSS(splitViewStoryCss)}
</style>`;
