import { LightningElement } from 'lwc';
import searchProductModal from 'c/searchProduct';
export default class SearchProductContainer extends LightningElement {

    async handleClick() {
        const result = await searchProductModal.open({
            size: 'large',
            desciption: 'Search Product Modal',
            label: "Seach Product",
            priceBook2Id: '01s1y000002ONZTAA4',
            index: '0',
            content: 'Simple Content from Parent'
        });
        console.log('Result ', result);
    }
}