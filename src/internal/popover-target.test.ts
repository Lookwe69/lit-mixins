import { LitElement } from 'lit';

import { expect } from '@open-wc/testing';

import { mixinPopoverTarget } from './popover-target.js';

describe('mixinPopoverTarget', () => {
	let id = 0;
	function setupTest() {
		class BaseElement extends mixinPopoverTarget(LitElement) {}
		customElements.define('base-element' + id++, BaseElement);
		return new BaseElement();
	}

	it('should have initial properties', () => {
		const instance = setupTest();
		expect(instance.popoverTarget).equal('');
		expect(instance.popoverTargetAction).equal('toggle');
		expect(instance.popoverTargetElement).equal(null);
	});

	it('should update popoverTarget on property change', () => {
		const instance = setupTest();
		instance.popoverTarget = 'my-popover';
		expect(instance.popoverTarget).equal('my-popover');
	});

	it('should update popoverTargetElement on popoverTarget change', async () => {
		const fixture = document.createElement('div');
		document.body.appendChild(fixture);

		const popoverTarget = document.createElement('div');
		popoverTarget.id = 'my-popover';
		fixture.appendChild(popoverTarget);

		const instance = setupTest();
		instance.popoverTarget = 'my-popover';
		fixture.appendChild(instance);

		expect(instance.popoverTargetElement).equal(popoverTarget);

		fixture.remove();
	});

	it('should return null for popoverTargetElement if target is not found', () => {
		const instance = setupTest();
		instance.popoverTarget = 'non-existent-id';
		expect(instance.popoverTargetElement).equal(null);
	});

	it('should return null for popoverTargetElement if target is disconnected', () => {
		const fixture = document.createElement('div');
		document.body.appendChild(fixture);

		const popoverTarget = document.createElement('div');
		popoverTarget.id = 'my-popover';
		fixture.appendChild(popoverTarget);

		const instance = setupTest();
		instance.popoverTarget = 'my-popover';
		fixture.appendChild(instance);

		expect(instance.popoverTargetElement).equal(popoverTarget);

		popoverTarget.remove();

		expect(instance.popoverTargetElement).equal(null);

		fixture.remove();
	});

	it('should update popoverTargetAction on property change', () => {
		const instance = setupTest();
		instance.popoverTargetAction = 'hide';
		expect(instance.popoverTargetAction).equal('hide');
	});
});
