import { fixture, expect } from '@open-wc/testing';

import './app.js';

describe('App component', () => {
    let element;

    beforeEach(async () => {
        element = await fixture('<my-schedules-app></my-schedules-app>');
    });

    [
        'app-header',
        'app-footer',
        'main',
        // Warning: the next ones will change, as the implementation progresses
        // TODO: remove this comment once void
        'app-schedules',
    ].forEach(innerElementTag => {
        it(`should render a new section with <${innerElementTag}> `, () => {
            expect(element.shadowRoot.querySelector(innerElementTag)).to.exist;
        });
    });
});
