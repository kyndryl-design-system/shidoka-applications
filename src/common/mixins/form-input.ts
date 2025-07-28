import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class FormMixinInterface {
  _internals: any;
  name: string;
  value: any;
  invalidText: string;
  _internalValidationMsg: string;
  _isInvalid: boolean;
  _handleInvalid: Function;
  _handleFormdata: Function;
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
    accessor _internals = this.attachInternals();

    /** Input value. */
    @property({ type: String })
    accessor value = '';

    /** Input name. */
    @property({ type: String })
    accessor name = '';

    /** Input invalid text. */
    @property({ type: String })
    accessor invalidText = '';

    /**
     * Internal validation message.
     * @ignore
     */
    @state()
    accessor _internalValidationMsg = '';

    /**
     * isInvalid when internalValidationMsg or invalidText is non-empty.
     * @ignore
     */
    @state()
    accessor _isInvalid = false;

    /**
     * Checks the validity of the element and returns true if valid.
     * Delegates to ElementInternals.checkValidity().
     * @returns {boolean} True if the element is valid; otherwise, false.
     */
    checkValidity() {
      return this._internals.checkValidity();
    }

    /**
     * Checks the validity of the element and reports validation errors to the user.
     * Delegates to ElementInternals.reportValidity().
     * @returns {boolean} True if the element is valid; otherwise, false.
     */
    reportValidity() {
      return this._internals.reportValidity();
    }

    /**
     * Returns the ValidityState object for the element.
     * Delegates to ElementInternals.validity.
     * @returns {ValidityState} The validity state of the element.
     */
    public get validity() {
      return this._internals.validity;
    }

    /**
     * Returns the current validation message for the element.
     * Delegates to ElementInternals.validationMessage.
     * @returns {string} The validation message.
     */
    public get validationMessage() {
      return this._internals.validationMessage;
    }

    // /** Handles the form element formdata event and appends the name/value. Alternative solution to internals.setFormValue.
    //  * @internal
    // */
    // private _handleFormdata = (e: any) => {
    //   e.formData.append(this.name, this.value);
    // };

    /** Handles the invalid event, triggered on form submit, and runs validation.
     * @internal
     */
    private _handleInvalid = () => {
      this._validate(true, false);
    };

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

      if (
        changedProps.has('invalidText') &&
        changedProps.get('invalidText') !== undefined
      ) {
        this._validate(false, false);
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
