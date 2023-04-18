import { LightningElement } from 'lwc';

export default class NewAccountComponent extends LightningElement {


    handleNext(event){
        event.preventDefault();
        const eventNext = new CustomEvent('next', {
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