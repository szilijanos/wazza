import { fixture, expect } from '@open-wc/testing';

import './resultsHeader.mjs';

describe('Results header component', () => {
    let rootElement;
    let headerRow;

    beforeEach(async () => {
        rootElement = await fixture('<results-header></results-header>');
        headerRow = rootElement.shadowRoot.querySelector('div.results-header-row');
    });

    it(`should render a new section with a results header row `, () => {
        expect(headerRow).to.exist;
    });

    it('should be styled', () => {
        Object.entries({
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'rgb(242, 244, 246)', // #f2f4f6'
            height: '21px',
        }).forEach(([cssProp, value]) => {
            expect(headerRow.parentNode.styleSheets[0].cssRules[0].style[cssProp]).to.equal(value);
        });
    });

    it('should contain three cells with description texts', () => {
        expect(headerRow.children.length).to.equal(3);
        ['indulás', 'információk', 'érkezés'].forEach((text, index) => {
            expect(headerRow.children[index].innerText).to.equal(text);
        });
    });
});
