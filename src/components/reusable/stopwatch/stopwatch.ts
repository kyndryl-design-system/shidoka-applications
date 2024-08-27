import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import StopwatchScss from './stopwatch.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import startIcon from '@carbon/icons/es/play/20';
import pauseIcon from '@carbon/icons/es/pause/20';
import stopIcon from '@carbon/icons/es/stop/20';
import resetIcon from '@carbon/icons/es/reset/20';

@customElement("kyn-stopwatch")
export class Stopwatch extends LitElement {
    static override styles = [StopwatchScss];

    @property({ type: String }) buttonSize = 'medium'; // small, medium, large
    @property({ type: String }) buttonDescription = 'Button description'; // small, medium, large

    @state() startTime = 0;
    @state() elapsedTime = 0;
    @state() timeInString = '00:00:00';
    @state() timerInterval: any;
    @state() timerState = 'stopped'; // stopped, running, paused


    override render() {
        return html`
            <div class="stopwatch-container">
                <h1>Stopwatch</h1>
                <div class="stopwatch-time">
                    <span>${this.timeInString}</span>
                </div>
                <div class="stopwatch-controls">
                    ${this.timerState === 'stopped' || this.timerState === 'paused'
                ? html`
                        <kd-button class="stopwatch-button" size=${this.buttonSize} description=${this.buttonDescription} @click=${() => this.startTimer()}>
                            <kd-icon slot="icon" .icon=${startIcon}>
                        </kd-button>
                        ${this.elapsedTime > 0 ? html`
                            <kd-button class="stopwatch-button" kind="secondary" size=${this.buttonSize} description=${this.buttonDescription} @click=${() => this.stopTimer()}>
                                <kd-icon slot="icon" .icon=${resetIcon}>
                            </kd-button>
                        ` : null}
                    `
                : html`
                        <kd-button class="stopwatch-button" size=${this.buttonSize} description=${this.buttonDescription} @click=${() => this.pauseTimer()}>
                            <kd-icon slot="icon" .icon=${pauseIcon}>
                        </kd-button>
                        <kd-button class="stopwatch-button" kind="secondary" size=${this.buttonSize} description=${this.buttonDescription} @click=${() => this.stopTimer()}>
                            <kd-icon slot="icon" .icon=${stopIcon}>
                        </kd-button>
                    `
            }
                </div>
            </div>
        `;
    }

    startTimer() {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.timeInString = this.timeToString(this.elapsedTime);
        }, 30);
        this.timerState = 'running';
    }

    pauseTimer() {
        clearInterval(this.timerInterval);
        this.timerState = 'paused';
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.elapsedTime = 0;
        this.timeInString = this.timeToString(this.elapsedTime);
        this.timerState = 'stopped';
    }

    timeToString(time: number) {
        const diffInHrs = time / 3600000;
        const hh = Math.floor(diffInHrs);

        const diffInMin = (diffInHrs - hh) * 60;
        const mm = Math.floor(diffInMin);

        const diffInSec = (diffInMin - mm) * 60;
        const ss = Math.floor(diffInSec);

        const diffInMs = (diffInSec - ss) * 100;
        const ms = Math.floor(diffInMs);

        const formattedMM = mm.toString().padStart(2, "0");
        const formattedSS = ss.toString().padStart(2, "0");
        const formattedMS = ms.toString().padStart(2, "0");

        return `${formattedMM}:${formattedSS}:${formattedMS}`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'kyn-stopwatch': Stopwatch;
    }
}