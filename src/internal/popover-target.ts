import { ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';

import { stringConverter } from '@lookwe/lit-converters';
import { MixinBase, MixinReturn } from '@lookwe/utils';

/**
 * An instance with all the useful properties to use the [Popover
 * api](https://developer.mozilla.org/docs/Web/API/Popover_API).
 */
export interface WithPopoverTarget {
	/**
	 * Defines id to retrieve the controlled popover element.
	 *
	 * https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement
	 */
	popoverTarget: string;

	/**
	 * Defines the controlled popover element.
	 *
	 * https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement
	 */
	popoverTargetElement: Element | null;

	/**
	 * Defines the action to be performed ("hide", "show", or "toggle") on a controlled popover element.
	 *
	 * https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction
	 */
	popoverTargetAction: 'hide' | 'show' | 'toggle';
}

/**
 * Mixes in popovertarget behavior for a class. This allows an element to control an external popover element.
 *
 * @param base  The class to mix functionality into.
 * @returns The provided class with `WithPopoverTarget` mixed in.
 * @example
 *
 * class MyButton extends mixinPopoverTarget(LitElement) {
 * 	render() {
 * 		return html`
 * 			<button
 * 				.popoverTargetElement=${this.popoverTargetElement}
 * 				.popoverTargetAction=${this.popoverTargetAction}
 * 			></button>
 * 		`;
 * 	}
 * }
 *
 */
export function mixinPopoverTarget<T extends MixinBase<ReactiveElement>>(base: T): MixinReturn<T, WithPopoverTarget> {
	abstract class WithPopoverTargetElement extends base implements WithPopoverTarget {
		@property({ reflect: true, attribute: 'popovertarget', converter: stringConverter })
		accessor popoverTarget: string = '';

		#popoverTargetElement: Element | null = null;
		@property({ attribute: false })
		set popoverTargetElement(popoverTargetElement: Element | null) {
			this.#popoverTargetElement = popoverTargetElement;
		}
		get popoverTargetElement() {
			if (this.#popoverTargetElement && this.#popoverTargetElement.isConnected) return this.#popoverTargetElement;
			return (this.#popoverTargetElement = this.#getPopoverTargetElement());
		}

		@property({ attribute: 'popovertargetaction' })
		accessor popoverTargetAction: 'hide' | 'show' | 'toggle' = 'toggle';

		#getPopoverTargetElement() {
			if (!this.popoverTarget) return null;
			const root = this.getRootNode() as ParentNode;
			return root.querySelector(`#${CSS.escape(this.popoverTarget)}`);
		}
	}

	return WithPopoverTargetElement;
}
