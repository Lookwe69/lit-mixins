import { LitElement, PropertyDeclaration } from 'lit';
import { property } from 'lit/decorators.js';

import { stringConverter } from '@lookwe/lit-converters';
import { MixinBase, MixinReturn } from '@lookwe/utils';

import { internals, WithElementInternals } from './element-internals.js';

/**
 * A form-associated element.
 *
 * IMPORTANT: Requires declares for lit-analyzer.
 *
 * @example
 *
 * const base = mixinFormAssociated(mixinElementInternals(LitElement));
 * class MyControl extends base {
 * 	// Writable mixin properties for lit-html binding, needed for lit-analyzer
 * 	declare disabled: boolean;
 * 	declare name: string;
 * }
 *
 */
export interface FormAssociated {
	/**
	 * The associated form element with which this element's value will submit.
	 */
	readonly form: HTMLFormElement | null;

	/**
	 * The labels this element is associated with.
	 */
	readonly labels: NodeList;

	/**
	 * The HTML name to use in form submission.
	 */
	name: string;

	/**
	 * Whether or not the element is disabled.
	 */
	disabled: boolean;

	/**
	 * Gets the current form value of a component.
	 *
	 * @returns The current form value.
	 */
	[getFormValue](): FormValue | null;

	/**
	 * Gets the current form state of a component. Defaults to the component's `[formValue]`.
	 *
	 * Use this when the state of an element is different from its value, such as checkboxes (internal boolean state and a
	 * user string value).
	 *
	 * @returns The current form state, defaults to the form value.
	 */
	[getFormState](): FormValue | null;

	/**
	 * A callback for when a form component should be disabled or enabled. This can be called in a variety of situations,
	 * such as disabled `<fieldset>`s.
	 *
	 * @param disabled  Whether or not the form control should be disabled.
	 */
	formDisabledCallback(disabled: boolean): void;

	/**
	 * A callback for when the form requests to reset its value. Typically, the default value that is reset is represented
	 * in the attribute of an element.
	 *
	 * This means the attribute used for the value should not update as the value changes. For example,
	 * a checkbox should not change its default `checked`
	 * attribute when selected. Ensure form values do not reflect.
	 */
	formResetCallback(): void;

	/**
	 * A callback for when the form restores the state of a component. For example,
	 * when a page is reloaded or forms are autofilled.
	 *
	 * @param state   The state to restore, or null to reset the form control's value.
	 * @param reason  The reason state was restored, either `'restore'` or `'autocomplete'`.
	 */
	formStateRestoreCallback(state: FormRestoreState | null, reason: FormRestoreReason): void;

	/**
	 * An optional callback for when the associated form changes.
	 *
	 * @param form  The new associated form, or `null` if there is none.
	 */
	formAssociatedCallback?(form: HTMLFormElement | null): void;
}

/**
 * The constructor of a `FormAssociated` element.
 */
export interface FormAssociatedConstructor {
	/**
	 * Indicates that an element is participating in form association.
	 */
	readonly formAssociated: true;
}

/**
 * A symbol property to retrieve the form value for an element.
 */
export const getFormValue = Symbol('getFormValue');

/**
 * A symbol property to retrieve the form state for an element.
 */
export const getFormState = Symbol('getFormState');

/**
 * Mixes in form-associated behavior for a class. This allows an element to add values to `<form>`
 * elements.
 *
 * Implementing classes should provide a `[formValue]` to return the current value of the element,
 * as well as reset and restore callbacks.
 *
 * @param base  The class to mix functionality into. The base class must use `mixinElementInternals()`.
 * @returns The provided class with `FormAssociated` mixed in.
 * @example
 *
 * const base = mixinFormAssociated(mixinElementInternals(LitElement));
 *
 * class MyControl extends base {
 *   \@property()
 *   accessor value = '';
 *
 *   override [getFormValue]() {
 *     return this.value;
 *   }
 *
 *   override formResetCallback() {
 *     const defaultValue = this.getAttribute('value');
 *     this.value = defaultValue;
 *   }
 *
 *   override formStateRestoreCallback(state: string) {
 *     this.value = state;
 *   }
 * }
 *
 * @example
 *
 * // Elements may optionally provide a `[formState]` if their values do not represent the state of the component.
 *
 * const BaseClass = mixinFormAssociated(mixinElementInternals(LitElement));
 *
 * class MyCheckbox extends BaseClass {
 *   \@property()
 *   accessor value = 'on';
 *
 *   \@property({type: Boolean})
 *   accessor checked = false;
 *
 *   override [getFormValue]() {
 *     return this.checked ? this.value : null;
 *   }
 *
 *   override [getFormState]() {
 *     return String(this.checked);
 *   }
 *
 *   override formResetCallback() {
 *     const defaultValue = this.hasAttribute('checked');
 *     this.checked = defaultValue;
 *   }
 *
 *   override formStateRestoreCallback(state: string) {
 *     this.checked = Boolean(state);
 *   }
 * }
 *
 */
export function mixinFormAssociated<T extends MixinBase<LitElement & WithElementInternals>>(
	base: T,
): MixinReturn<T & FormAssociatedConstructor, FormAssociated> {
	abstract class FormAssociatedElement extends base implements FormAssociated {
		static readonly formAssociated = true;

		get form() {
			return this[internals].form;
		}

		get labels() {
			return this[internals].labels;
		}

		@property({ reflect: true, converter: stringConverter })
		accessor name: string = '';

		@property({ type: Boolean })
		accessor disabled: boolean = false;

		override requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
			super.requestUpdate(name, oldValue, options);
			// If any properties change, update the form value, which may have changed
			// as well.
			// Update the form value synchronously in `requestUpdate()` rather than
			// `update()` or `updated()`, which are async. This is necessary to ensure
			// that form data is updated in time for synchronous event listeners.

			if (!name) return;
			this.#updateFormValue();
		}

		override connectedCallback(): void {
			super.connectedCallback();
			this.#updateFormValue();
		}

		#updateFormValue() {
			if (!this.isConnected) return;
			this[internals].setFormValue(this[getFormValue](), this[getFormState]());
		}

		abstract [getFormValue](): FormValue | null;

		[getFormState](): FormValue | null {
			return this[getFormValue]();
		}

		formDisabledCallback(disabled: boolean) {
			this.disabled = disabled;
		}

		abstract formResetCallback(): void;

		abstract formStateRestoreCallback(state: FormRestoreState | null, reason: FormRestoreReason): void;
	}

	return FormAssociatedElement;
}

/**
 * A value that can be provided for form submission and state.
 */
export type FormValue = File | string | FormData;

/**
 * A value to be restored for a component's form value. If a component's form state is a `FormData`
 * object, its entry list of name and values will be provided.
 */
export type FormRestoreState = File | string | Array<[string, FormDataEntryValue]>;

/**
 * The reason a form component is being restored for, either `'restore'` for browser restoration or `'autocomplete'` for
 * restoring user values.
 */
export type FormRestoreReason = 'restore' | 'autocomplete';
