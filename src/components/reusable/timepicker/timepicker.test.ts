import { TimePicker } from '../../../../dist/index.js';
import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-time-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-time-picker');
    assert.instanceOf(el, TimePicker);
  });

  test('is disabled', async () => {
    const el = await fixture(html`<kyn-time-picker size="md" name="timepicker" value="" caption="" invalidtext="" warntext="" disabled>Time</kyn-time-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="time-picker" disabled="">
        <label class="label-text" for="timepicker">
          <slot></slot>
        </label>

        <div class=" input-wrapper ">
          <input type="time" class="  " id="timepicker" name="timepicker" value="" step="" min="" max="" disabled="">
        </div>
      </div>
    `
    );
  });

  test('with lg size', async () => {
    const el = await fixture(html`<kyn-time-picker size="lg" name="timepicker" value="" caption="" invalidtext="" warntext="">Time</kyn-time-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="time-picker">
        <label class="label-text" for="timepicker">
          <slot></slot>
        </label>

        <div class=" input-wrapper ">
          <input type="time" class="size--lg" id="timepicker" name="timepicker" value="" step="" min="" max="">
        </div>
      </div>
    `
    );
  });

  test('with sm size', async () => {
    const el = await fixture(html`<kyn-time-picker size="sm" name="timepicker" value="" caption="" invalidtext="" warntext="">Time</kyn-time-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="time-picker">
        <label class="label-text" for="timepicker">
          <slot></slot>
        </label>

        <div class=" input-wrapper ">
          <input type="time" class="size--sm" id="timepicker" name="timepicker" value="" step="" min="" max="">
        </div>
      </div>
    `
    );
  });
});