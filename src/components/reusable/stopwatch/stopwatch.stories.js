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
    buttonDescription: 'Button Description'
};

export const Stopwatch = {
    args,
    render: (args) => {
        return html`
            <kyn-stopwatch
                buttonSize=${args.buttonSize}
                buttonDescription=${args.description}
            ></kyn-stopwatch>
        `;
    },
};