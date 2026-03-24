import splitViewRaw from './splitView.scss?inline';

const SECTION =
  /\/\*\s*@split-view-section:\s*(\w+)\s*\*\/([\s\S]*?)(?=\/\*\s*@split-view-section:|$)/g;

function parseSplitViewSections(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of raw.matchAll(SECTION)) {
    out[m[1]] = m[2].trim();
  }
  const required = ['pattern', 'railHost', 'blockFlush', 'storyLight'];
  for (const key of required) {
    if (!out[key]) {
      throw new Error(
        `splitView.scss: missing @split-view-section: ${key} block`
      );
    }
  }
  return out;
}

const sections = parseSplitViewSections(splitViewRaw);

/** Shadow styles for `<split-view-pattern>`. */
export const SPLIT_VIEW_PATTERN_SHADOW_CSS = sections.pattern;

/** Shadow host styles for `<split-view-code-rail>`. */
export const SPLIT_VIEW_CODE_RAIL_SHADOW_CSS = sections.railHost;

/** Injected into `kyn-block-code-view` shadow (flush rail). */
export const SPLIT_VIEW_BLOCK_CODE_FLUSH_CSS = sections.blockFlush;

/** Light-DOM styles for the Storybook shell + issue-detail demo. */
export const SPLIT_VIEW_STORY_LIGHT_DOM_CSS = sections.storyLight;
