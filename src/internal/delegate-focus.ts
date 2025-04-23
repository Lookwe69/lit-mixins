import { ReactiveElement } from 'lit';

import { MixinBase, MixinReturn } from '@lookwe/utils/types';

/**
 * A unique symbol to retrieve the focus element.
 *
 * @example
 *
 * class MyElement extends mixinDelegatesFocus(ReactiveElement) {
 * 	overrride [getFocusElement](): HTMLElement | null {
 *      return this.renderRoot.querySelector('[tabindex="0"]');
 *  }
 * }
 *
 */
export const getFocusElement = Symbol('getFocusElement');

/**
 * An instance with an `getFocusElement` symbol property for the component's focus element.
 */
export interface WithDelegatesFocus {
	[getFocusElement]?(): HTMLElement | null;
}

/**
 * The constructor of a `WithDelegatesFocus` element.
 */
export interface WithDelegatesFocusConstructor {
	/**
	 * Options used when calling attachShadow. The first focusable part is given focus.
	 */
	readonly shadowRootOptions: ShadowRootInit & { delegatesFocus: true };
}

/**
 * The first focusable part is given focus, and the shadow host is given any available :focus styling.
 *
 * @param base  The class to mix functionality into.
 * @returns The provided class with `WithDelegatesFocus` mixed in.
 */
export function mixinDelegatesFocus<T extends MixinBase<ReactiveElement> & { shadowRootOptions: ShadowRootInit }>(
	base: T,
): MixinReturn<T & WithDelegatesFocusConstructor, WithDelegatesFocus> {
	abstract class WithDelegatesFocusElement extends base implements WithDelegatesFocus {
		static override shadowRootOptions = {
			...super.shadowRootOptions,
			delegatesFocus: true as const,
		};

		override focus(options?: FocusOptions): void {
			const focusElement = this[getFocusElement]();
			if (focusElement && focusElement !== this) focusElement.focus(options);
			else super.focus(options);
		}

		override blur(): void {
			const focusElement = this[getFocusElement]();
			if (focusElement && focusElement !== this) focusElement.blur();
			else super.blur();
		}

		[getFocusElement](): HTMLElement | null {
			return this;
		}
	}

	return WithDelegatesFocusElement;
}
