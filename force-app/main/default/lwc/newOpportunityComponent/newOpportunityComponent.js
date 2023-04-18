import { LightningElement } from 'lwc';

export default class NewOpportunityComponent extends LightningElement {

    handleNext(event){
        event.preventDefault();
        event.preventDefault();
        const eventNext = new CustomEvent('next', {
            detail: {
                showContact     : false,
                showAccount     : false,
                showOpportunity : false,
                showProduct     : true
            }
        });
        this.dispatchEvent(eventNext);
    }

    handlePrevious(event){
        event.preventDefault();
        const eventNext = new CustomEvent('previous', {
            detail: {
                showContact     : true,
                showAccount     : false,
                showOpportunity : false,
                showProduct     : false
            }
        });
        this.dispatchEvent(eventNext);
    }
}