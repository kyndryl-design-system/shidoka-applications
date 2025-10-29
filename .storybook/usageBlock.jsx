import React from 'react';
import { useOf, Source } from '@storybook/addon-docs/blocks';

export const UsageExample = () => {
  const resolvedOf = useOf('story');

  const storyComponent = resolvedOf?.story?.component;
  const storyFileName = resolvedOf?.story?.parameters?.fileName;

  if (!storyComponent || !storyFileName) {
    return null;
  }

  const TagHtml = `<${storyComponent}></${storyComponent}>`;
  const FileName = storyFileName
    .split('./src')
    .join('@kyndryl-design-system/shidoka-applications')
    .split('/');
  FileName.pop();

  return (
    <>
      <h2 id="usage">Usage</h2>

      <h3 id="usage-js-import">JS Import</h3>
      <Source code={`import '${FileName.join('/')}';`} />

      <h3 id="usage-html-tag">HTML Tag</h3>
      <Source code={TagHtml} />
    </>
  );
};
