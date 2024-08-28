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

    // private _handleFormdata(e: any) {
    //   e.formData.append(this.name, this.value);
    // }

    private _handleInvalid() {
      this._validate(true, false);
    }

    abstract _validate(interacted: Boolean, report: Boolean): void;

    override updated(changedProps: any) {
      if (changedProps.has('value')) {
        this._internals.setFormValue(this.value);
      }

      if (
        changedProps.has('invalidText') ||
        changedProps.has('_internalValidationMsg')
      ) {
        //check if any (internal / external) error msg. present then isInvalid is true
        this._isInvalid =
          this.invalidText !== '' || this._internalValidationMsg !== ''
            ? true
            : false;
      }

      if (changedProps.has('value') || changedProps.has('invalidText')) {
        this._validate(false, false);
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();

      if (this._internals.form) {
        // this._internals.form.addEventListener('formdata', (e) =>
        //   this._handleFormdata(e)
        // );

        this.addEventListener('invalid', this._handleInvalid);
      }
    }

    override disconnectedCallback(): void {
      if (this._internals.form) {
        // this._internals.form.removeEventListener('formdata', (e) =>
        //   this._handleFormdata(e)
        // );

        this.removeEventListener('invalid', this._handleInvalid);
      }

      super.disconnectedCallback();
    }
  }

  // @ts-ignore
  return FormMixinClass as Constructor<FormMixinInterface> & T;
};
