import { html } from 'lit';
import './index';

export default {
    title: 'Components/Stopwatch',
    component: 'kyn-stopwatch',
    argTypes: {
        buttonSize : {
            options: ['small', 'medium', 'large'],
            control: { type: 'select' },
        }
    }
};

const args = {
    buttonSize: 'medium',
    startButtonDescription: 'Start button',
    pauseButtonDescription: 'Pause button',
    stopButtonDescription: 'Stop button',
    resetButtonDescription: 'Reset button'
};

export const Stopwatch = {
    args,
    render: (args) => {
        return html`
            <kyn-stopwatch
                buttonSize=${args.buttonSize}
                startButtonDescription=${args.startButtonDescription}
                pauseButtonDescription=${args.pauseButtonDescription}
                stopButtonDescription=${args.stopButtonDescription}
                resetButtonDescription=${args.resetButtonDescription}
            ></kyn-stopwatch>
        `;
    },
};