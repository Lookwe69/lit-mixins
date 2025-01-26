# Lit Mixins

This repository provides a collection of mixins for enhancing [LitElement](https://lit.dev/) components with advanced functionalities, including element internals, form association, focus delegation, popover control and more...

## Installation

Install the mixins package using npm:

```bash
npm install @lookwe/lit-mixins
```

---

## Available Mixins

### 1. **`mixinElementInternals`**

Provides access to the `ElementInternals` API for a custom element, allowing you to manage form participation, accessibility roles, and more.

**Usage Example:**

```ts
import { LitElement } from 'lit';

import { internals, mixinElementInternals } from '@lookwe/lit-mixins';

class MyElement extends mixinElementInternals(LitElement) {
	constructor() {
		super();
		this[internals].role = 'button'; // Assign a role for accessibility
	}
}
customElements.define('my-element', MyElement);
```

**Key Features:**

- Provides a `readonly` property `[internals]` to access `ElementInternals`.

---

### 2. **`mixinFormAssociated`**

Enables your custom element to integrate with HTML forms, similar to native form controls.

**Usage Example:**

```ts
import { LitElement } from 'lit';
import { property } from 'lit/decorator.js';

import { getFormValue, mixinElementInternals, mixinFormAssociated } from '@lookwe/lit-mixins';

class MyFormControl extends mixinFormAssociated(mixinElementInternals(LitElement)) {
	@property() accessor value = '';

	// ...

	[getFormValue]() {
		return this.value; // Return the form value
	}

	formResetCallback() {
		this.value = this.getAttribute('value') || ''; // Reset value on form reset
	}

	formStateRestoreCallback(state) {
		this.value = state || ''; // Restore form state
	}
}
customElements.define('my-form-control', MyFormControl);
```

**Key Features:**

- Provides properties like `form`, `labels`, and `name` for form integration.
- Supports callbacks like `formResetCallback` and `formStateRestoreCallback` for custom behaviors.

---

### 3. **`mixinDelegateFocus`**

Allows your component to delegate focus to a specific internal element, enhancing accessibility.

**Usage Example:**

```ts
import { html, LitElement } from 'lit';

import { getFocusElement, mixinDelegateFocus } from '@lookwe/lit-mixins';

class MyFocusableElement extends mixinDelegateFocus(LitElement) {
	render() {
		return html` <div tabindex="0">Focusable Content</div> `;
	}

	[getFocusElement]() {
		return this.shadowRoot.querySelector('[tabindex="0"]'); // Delegate focus to this element
	}
}
customElements.define('my-focusable-element', MyFocusableElement);
```

**Key Features:**

- Delegates focus to the first focusable child element.
- Supports overriding `focus()` and `blur()` methods.

---

### 4. **`mixinPopoverTarget`**

Enables your component to act as a controller for popovers, using the Popover API.

**Usage Example:**

```ts
import { html, LitElement } from 'lit';

import { mixinPopoverTarget } from '@lookwe/lit-mixins';

class MyPopoverController extends mixinPopoverTarget(LitElement) {
	render() {
		return html`
			<button
				.popoverTargetElement="${this.popoverTargetElement}"
				.popoverTargetAction="${this.popoverTargetAction}"
			>
				Toggle Popover
			</button>
		`;
	}
}
customElements.define('my-popover-controller', MyPopoverController);
```

**Key Features:**

- Provides properties like `popoverTarget`, `popoverTargetElement`, and `popoverTargetAction`.
- Supports actions such as `'hide'`, `'show'`, and `'toggle'`.
