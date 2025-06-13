import { html } from 'lit';
import { render } from 'lit-html';
import '../components/reusable/textArea';
import '../components/reusable/tag';

export default {
  title: 'Patterns/Invite User Email',
  component: 'kyn-text-area',
};

const users = [
  'john.doe@example.com',
  'jane.smith@example.com',
  'user@example.com',
];

export const InviteUserEmail = () => {
  const container = document.createElement('div');
  let tags = [];

  const onKeydown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const textarea = e.target;
    const parts = textarea.value.split(',');
    const newEmail = parts.pop().trim();
    if (!newEmail) return;
    const found = users.includes(newEmail);
    tags = [...tags, { email: newEmail, found }];
    textarea.value = '';
    update();
  };

  const update = () => {
    render(
      html`
        <kyn-text-area
          rows="5"
          placeholder="Enter user email and press Enter"
          @keydown=${onKeydown}
          style="width: 95%; max-width: 600px;"
        ></kyn-text-area>

        ${tags.length
          ? html`
              <kyn-tag-group
                tagSize="md"
                filter
                style="margin-top: 10px;"
                .textStrings=${{ showAll: 'Show all', showLess: 'Show less' }}
              >
                ${tags.map(
                  ({ email, found }) => html`
                    <kyn-tag
                      status=${found ? 'success' : 'error'}
                      class=${found
                        ? 'tag-status--success'
                        : 'tag-status--error'}
                      tagColor=${found ? 'spruce' : 'lilac'}
                      label=${email}
                    ></kyn-tag>
                  `
                )}
              </kyn-tag-group>
            `
          : null}
      `,
      container
    );
  };

  update();
  return container;
};
