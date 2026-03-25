import { html, unsafeCSS } from 'lit';

import { registerSplitViewPattern } from './splitViewPattern';
import { registerSplitViewCodeRail } from './splitViewCodeRail';

import {
  SPLIT_VIEW_PATTERN_SHADOW_CSS,
  SPLIT_VIEW_CODE_RAIL_SHADOW_CSS,
  SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS,
  SPLIT_VIEW_STORY_LIGHT_DOM_CSS,
} from 'virtual:split-view-css';

registerSplitViewPattern(SPLIT_VIEW_PATTERN_SHADOW_CSS);
registerSplitViewCodeRail(
  SPLIT_VIEW_CODE_RAIL_SHADOW_CSS,
  SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS
);

export const splitViewStoryStyles = html`<style>
  ${unsafeCSS(SPLIT_VIEW_STORY_LIGHT_DOM_CSS)}
</style>`;
