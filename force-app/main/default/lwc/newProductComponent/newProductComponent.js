import { LightningElement } from 'lwc';

export default class NewProductComponent extends LightningElement {

    handleNext(event){
        event.preventDefault();
        // logic to save the data
    }

    handlePrevious(event){
        event.preventDefault();
        const eventNext = new CustomEvent('previous', {
            detail: {
                showContact     : false,
                showAccount     : false,
                showOpportunity : true,
                showProduct     : false
            }
        });
        this.dispatchEvent(eventNext);
    }
}