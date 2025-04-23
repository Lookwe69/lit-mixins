import { LitElement } from 'lit';

import { expect } from '@open-wc/testing';

import { internals, mixinElementInternals } from './element-internals.js';

describe('mixinElementInternals', () => {
	let id = 0;
	function setupTest() {
		class BaseElement extends mixinElementInternals(LitElement) {}
		customElements.define('base-element' + id++, BaseElement);
		return new BaseElement();
	}

	it('should return an ElementInternals instance', () => {
		const instance = setupTest();
		expect(instance[internals]).instanceOf(ElementInternals);
	});

	it('should create only one ElementInternals instance', () => {
		const instance = setupTest();
		const internals1 = instance[internals];
		const internals2 = instance[internals];
		expect(internals1).equal(internals2);
	});

	it('should allow setting properties on the internals object', () => {
		const instance = setupTest();
		instance[internals].role = 'button';
		expect(instance[internals].role).equal('button');
	});

	it('should create internals even if accessed during construction', () => {
		class TestElement extends mixinElementInternals(LitElement) {
			constructor() {
				super();
				// Access internals during construction
				this[internals].ariaLabel = 'test';
			}
		}
		customElements.define('test-element' + id++, TestElement);
		const instance = new TestElement();
		expect(instance[internals].ariaLabel).equal('test');
		expect(instance[internals]).instanceOf(ElementInternals);
	});
});
