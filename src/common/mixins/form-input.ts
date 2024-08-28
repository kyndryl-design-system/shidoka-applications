import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class FormMixinInterface {
  _internals: any;
  name: string;
  value: string;
  invalidText: string;
  _internalValidationMsg: string;
  _isInvalid: boolean;
  _onUpdated: Function;
  _onConnected: Function;
  _onDisconnected: Function;
}

export const FormMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  abstract class FormMixinClass extends superClass {
    /**
     * Delegate focus internally.
     * @ignore */
    static shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true,
    };

    /**
     * Associate the component with forms.
     * @ignore
     */
    static formAssociated = true;

    /**
     * Attached internals for form association.
     * @ignore
     */
    @state()
    _internals = this.attachInternals();

    /** Input value. */
    @property({ type: String })
    value = '';

    /** Input name. */
    @property({ type: String })
    name = '';

    /** Input invalid text. */
    @property({ type: String })
    invalidText = '';

    /**
     * Internal validation message.
     * @ignore
     */
    @state()
    _internalValidationMsg = '';

    /**
     * isInvalid when internalValidationMsg or invalidText is non-empty.
     * @ignore
     */
    @state()
    _isInvalid = false;

    // /** Handles the form element formdata event and appends the name/value. Alternative solution to internals.setFormValue. */
    // private _handleFormdata(e: any) {
    //   e.formData.append(this.name, this.value);
    // }

    /** Handles the invalid event, triggered on form submit, and runs validation. */
    private _handleInvalid() {
      this._validate(true, false);
    }

    /** Component _validate function reference. */
    abstract _validate(interacted: Boolean, report: Boolean): void;

    private _onUpdated(changedProps: any) {
      if (changedProps.has('value')) {
        // set form value on element internals
        this._internals.setFormValue(this.value);

        // trigger validation
        this._validate(false, false);
      }

      if (
        changedProps.has('invalidText') ||
        changedProps.has('_internalValidationMsg')
      ) {
        // set _isInvalid prop based on internal or external invalid message presence
        this._isInvalid =
          this.invalidText !== '' || this._internalValidationMsg !== ''
            ? true
            : false;
      }
    }

    override updated(changedProps: any) {
      this._onUpdated(changedProps);
    }

    private _onConnected() {
      // attach event listeners if within a form
      if (this._internals.form) {
        // this._internals.form.addEventListener('formdata', (e) =>
        //   this._handleFormdata(e)
        // );

        this.addEventListener('invalid', this._handleInvalid);
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this._onConnected();
    }

    private _onDisconnected() {
      // detach event listeners if within a form
      if (this._internals.form) {
        // this._internals.form.removeEventListener('formdata', (e) =>
        //   this._handleFormdata(e)
        // );

        this.removeEventListener('invalid', this._handleInvalid);
      }
    }

    override disconnectedCallback(): void {
      this._onDisconnected();

      super.disconnectedCallback();
    }
  }

  // @ts-ignore
  return FormMixinClass as Constructor<FormMixinInterface> & T;
};
