import React from 'react';
import { useOf, Source } from '@storybook/addon-docs/blocks';

export const UsageExample = () => {
  const resolvedOf = useOf('story');

  const TagHtml = `<${resolvedOf.story.component}></${resolvedOf.story.component}>`;
  const FileName = resolvedOf.story.parameters.fileName
    .split('./src')
    .join('@kyndryl-design-system/shidoka-applications')
    .split('/');
  FileName.pop();

  if (!resolvedOf.story.component) {
    return;
  }

  return (
    <>
      <h2 data-no-toc>Usage</h2>

      <h3 data-no-toc>JS Import</h3>
      <Source code={`import '${FileName.join('/')}';`} />

      <h3 data-no-toc>HTML Tag</h3>
      <Source code={TagHtml} />
    </>
  );
};
