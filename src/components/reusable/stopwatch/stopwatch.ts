import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import StopwatchScss from './stopwatch.scss';

import '@kyndryl-design-system/shidoka-foundation/components/button';
import '@kyndryl-design-system/shidoka-foundation/components/icon';
import startIcon from '@carbon/icons/es/play/20';
import pauseIcon from '@carbon/icons/es/pause/20';
import stopIcon from '@carbon/icons/es/stop/20';
import resetIcon from '@carbon/icons/es/reset/20';

/**
 * Stopwatch.
 * @fires on-pause - Emits the current time when the stopwatch is paused.
 * @fires on-stop - Emits the current time when the stopwatch is stopped or reset.
 */
@customElement("kyn-stopwatch")
export class Stopwatch extends LitElement {
    static override styles = [StopwatchScss];

    /** 
     * Start, Reset, Pause & Stop button size. `'small'`, `'medium'` (default), `'large'`.
     */
    @property({ type: String }) buttonSize = 'medium';

    /** Start button description. */
    @property({ type: String }) startButtonDescription = 'Start button';

    /** Pause button description. */
    @property({ type: String }) pauseButtonDescription = 'Pause button';

    /** Stop button description. */
    @property({ type: String }) stopButtonDescription = 'Stop button';

    /** Reset button description. */
    @property({ type: String }) resetButtonDescription = 'Reset button';

    /** Start time in milliseconds.
     * @internal
     */
    @state()
    _startTime = 0;

    /** Elapsed time in milliseconds.
     * @internal
     */
    @state()
    _elapsedTime = 0;

    /** Time in string format.
     * @internal
     */
    @state()
    _timeInString = '00:00:00';

    /** Timer interval.
     * @internal
     */
    @state()
    _timerInterval: any;

    /** Timer state. `'stopped'`, `'running'`, `'paused'`.
     * @internal
     */
    @state()
    _timerState = 'stopped';


    override render() {
        return html`
            <div class="stopwatch-container">
                <p>Stopwatch</p>
                <div class="stopwatch-time">
                    <span>${this._timeInString}</span>
                </div>
                <div class="stopwatch-controls">
                    ${this._timerState === 'stopped' || this._timerState === 'paused'
                ? html`
                        <kd-button class="stopwatch-button" size=${this.buttonSize} description=${this.startButtonDescription} @click=${() => this._startTimer()}>
                            <kd-icon slot="icon" .icon=${startIcon}>
                        </kd-button>
                        ${this._elapsedTime > 0 ? html`
                            <kd-button class="stopwatch-button" kind="secondary" size=${this.buttonSize} description=${this.resetButtonDescription} @click=${() => this._stopTimer()}>
                                <kd-icon slot="icon" .icon=${resetIcon}>
                            </kd-button>
                        ` : null}
                    `
                : html`
                        <kd-button class="stopwatch-button" size=${this.buttonSize} description=${this.pauseButtonDescription} @click=${() => this._pauseTimer()}>
                            <kd-icon slot="icon" .icon=${pauseIcon}>
                        </kd-button>
                        <kd-button class="stopwatch-button" kind="secondary" size=${this.buttonSize} description=${this.stopButtonDescription} @click=${() => this._stopTimer()}>
                            <kd-icon slot="icon" .icon=${stopIcon}>
                        </kd-button>
                    `
            }
                </div>
            </div>
        `;
    }

    private _startTimer() {
        this._startTime = Date.now() - this._elapsedTime;
        this._timerInterval = setInterval(() => {
            this._elapsedTime = Date.now() - this._startTime;
            this._timeInString = this._timeToString(this._elapsedTime);
        }, 30);
        this._timerState = 'running';
    }

    private _pauseTimer() {
        clearInterval(this._timerInterval);
        this._timerState = 'paused';
        this._emitPause();
    }

    private _stopTimer() {
        clearInterval(this._timerInterval);
        this._timerState = 'stopped';
        this._emitStop();
        this._elapsedTime = 0;
        this._timeInString = this._timeToString(this._elapsedTime);
    }

    private _timeToString(time: number) {
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

    private _emitPause() {
        const event = new CustomEvent('on-pause', {
            detail: {
                time: this._timeInString,
                action: 'pause'
            }
        });
        this.dispatchEvent(event);
    }

    private _emitStop() {
        const event = new CustomEvent('on-stop', {
            detail: {
                time: this._timeInString,
                action: 'stop'
            }
        });
        this.dispatchEvent(event);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'kyn-stopwatch': Stopwatch;
    }
}