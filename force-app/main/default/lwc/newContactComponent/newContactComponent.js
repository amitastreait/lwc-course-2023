import { LightningElement } from 'lwc';

export default class NewContactComponent extends LightningElement {

    handleNext(event){
        event.preventDefault();
        const eventNext = new CustomEvent('next', {
            detail: {
                showContact     : false,
                showAccount     : false,
                showOpportunity : true,
                showProduct     : false
            }
        });
        this.dispatchEvent(eventNext);
    }

    handlePrevious(event){
        event.preventDefault();
        const eventNext = new CustomEvent('previous', {
            detail: {
                showContact     : false,
                showAccount     : true,
                showOpportunity : false,
                showProduct     : false
            }
        });
        this.dispatchEvent(eventNext);
    }
}