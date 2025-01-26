import { LitElement } from 'lit';

import { MixinBase, MixinReturn } from '@lookwe/utils';

/**
 * A unique symbol used for protected access to an instance's `ElementInternals`.
 *
 * @example
 *
 * class MyElement extends mixinElementInternals(LitElement) {
 * 	constructor() {
 * 		super();
 * 		this[internals].role = 'button';
 * 	}
 * }
 *
 */
export const internals = Symbol('internals');

/**
 * An instance with an `internals` symbol property for the component's `ElementInternals`.
 *
 * Use this when protected access is needed for an instance's `ElementInternals`
 * from other files. A unique symbol is used to access the internals.
 */
export interface WithElementInternals {
	/**
	 * An instance's `ElementInternals`.
	 */
	readonly [internals]: ElementInternals;
}

/**
 * Mixes in an attached `ElementInternals` instance.
 *
 * This mixin is only needed when other shared code needs access to a component's `ElementInternals`, such as
 * form-associated mixins.
 *
 * @param base  The class to mix functionality into.
 * @returns The provided class with `WithElementInternals` mixed in.
 */
export function mixinElementInternals<T extends MixinBase<LitElement>>(base: T): MixinReturn<T, WithElementInternals> {
	abstract class WithElementInternalsElement extends base implements WithElementInternals {
		get [internals]() {
			// Create internals in getter so that it can be used in methods called on
			// construction in `ReactiveElement`, such as `requestUpdate()`.
			if (!this.#internals) {
				this.#internals = this.attachInternals();
			}

			return this.#internals;
		}

		#internals?: ElementInternals;
	}

	return WithElementInternalsElement;
}
