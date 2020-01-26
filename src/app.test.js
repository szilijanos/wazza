import { fixture, expect } from '@open-wc/testing';

import './app.mjs';

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

    it('should be styled', () => {
        Object.entries({
            width: '880px',
            margin: '0px auto',
            display: 'block',
            backgroundColor: 'rgb(56, 56, 66)', // #383842
            border: '2px solid rgb(96, 96, 104)', // #606068
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 10px',
        }).forEach(([cssProp, value]) => {
            expect(element.shadowRoot.styleSheets[0].cssRules[0].style[cssProp]).to.equal(value);
        });
    });
});
