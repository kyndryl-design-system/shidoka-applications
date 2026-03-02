import { html } from 'lit';

import './index';

export default {
  title: 'Components/Data Display/Mermaid',
  component: 'kyn-mermaid',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/wWpIJDfwm1SHkhvpz5WkcI/Cinnamon-2.10?node-id=711-9193&m=dev',
    },
  },
};

const args = {
  unnamed: '',
  mermaidConfig: {},
};

export const Flowchart = {
  args: {
    ...args,
    unnamed: `flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`,
  },
  render: (args) => {
    return html`
      <kyn-mermaid .mermaidConfig=${args.mermaidConfig}>
        ${args.unnamed}
      </kyn-mermaid>
    `;
  },
};

export const Sequence = {
  args: {
    ...args,
    unnamed: `sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!`,
  },
  render: (args) => {
    return html`
      <kyn-mermaid .mermaidConfig=${args.mermaidConfig}>
        ${args.unnamed}
      </kyn-mermaid>
    `;
  },
};

export const Architecture = {
  args: {
    ...args,
    unnamed: `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db`,
  },
  render: (args) => {
    return html`
      <kyn-mermaid .mermaidConfig=${args.mermaidConfig}>
        ${args.unnamed}
      </kyn-mermaid>
    `;
  },
};

export const GitGraph = {
  args: {
    ...args,
    unnamed: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout main
    merge feature`,
  },
  render: (args) => {
    return html`
      <kyn-mermaid .mermaidConfig=${args.mermaidConfig}>
        ${args.unnamed}
      </kyn-mermaid>
    `;
  },
};
