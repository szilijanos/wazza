import { fixture, expect } from '@open-wc/testing';

import './schedules.mjs';

describe('Schedules component', () => {
    let element;

    beforeEach(async () => {
        element = await fixture('<app-schedules></app-schedules>');
    });

    it('should render a results header', () => {
        expect(element.shadowRoot.querySelector('results-header')).to.exist;
    });
});
