import { DatePicker } from '../../../../dist/index.js';
import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('kyn-date-picker', () => {
  test('is defined', () => {
    const el = document.createElement('kyn-date-picker');
    assert.instanceOf(el, DatePicker);
  });

  test('single - with props', async () => {
    const el = await fixture(html`<kyn-date-picker size="md" name="datepicker" placeholder="" datepickertype="single" caption="" invalidtext="" warntext="" value="">Date</kyn-date-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <label class="datepicker-label-text" for="datepicker">
        <slot></slot>
      </label>
      <div class=" input-wrapper ">
        <input class="  " datepickertype="single" type="date" id="datepicker" name="datepicker" value="" min="" max="" step="">
      </div>
    `
    );
  });

  test('date-time - with props', async () => {
    const el = await fixture(html`<kyn-date-picker size="md" name="datepicker" placeholder="" datepickertype="date-time" caption="" invalidtext="" warntext="" value="">Date</kyn-date-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <label class="datepicker-label-text" for="datepicker">
        <slot></slot>
      </label>
      <div class=" input-wrapper ">
        <input class="  " datepickertype="date-time" type="datetime-local" id="datepicker" name="datepicker" value="" min="" max="" step="">
      </div>
    `
    );
  });

  test('disabled', async () => {
    const el = await fixture(html`<kyn-date-picker size="md" name="datepicker" placeholder="" datepickertype="single" caption="" invalidtext="" warntext="" value="" disabled="">Date</kyn-date-picker>`);
    assert.shadowDom.equal(
      el,
      `
      <label class="datepicker-label-text" for="datepicker" disabled>
        <slot></slot>
      </label>
      <div class=" input-wrapper ">
        <input class="  " datepickertype="single" type="date" id="datepicker" name="datepicker" value="" min="" max="" step="" disabled="">
      </div>
    `
    );
  });

});