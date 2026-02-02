import { html } from 'lit';
import '../../reusable/badge';
import '../../reusable/button';
import '../../reusable/thumbnail';
import userIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/user.svg';
import teamIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/16/team.svg';
import './aiInputQuery';

export default {
  title: 'AI/Components/AI Input Query',
};

export const Default = {
  args: {
    showFirstBadge: true,
    firstBadgeIcon: userIcon,
    firstBadgeValue: 'Agentic Solutions',
    firstIconTitle: 'Agentic Solutions',
    showSecondBadge: true,
    secondBadgeIcon: teamIcon,
    secondBadgeValue: 'Advisor',
    secondIconTitle: 'Advisor',
    showSendButton: true,
    showStopButton: true,
  },
  render: (args) =>
    html`
      <kyn-ai-input-query
        .showFirstBadge=${args.showFirstBadge}
        .firstBadgeIcon=${args.firstBadgeIcon}
        .firstBadgeValue=${args.firstBadgeValue}
        .firstIconTitle=${args.firstIconTitle}
        .showSecondBadge=${args.showSecondBadge}
        .secondBadgeIcon=${args.secondBadgeIcon}
        .secondBadgeValue=${args.secondBadgeValue}
        .secondIconTitle=${args.secondIconTitle}
        .showSendButton=${args.showSendButton}
        .showStopButton=${args.showStopButton}
      ></kyn-ai-input-query>
    `,
};
