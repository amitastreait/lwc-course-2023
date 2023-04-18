import { LightningElement } from 'lwc';

export default class AccountWithContactsAndOpportunity extends LightningElement {

    currentStep = 'Account';

    showContact     = false;
    showAccount     = true;
    showOpportunity = false;
    showProduct     = false;

    stepValues = [
        {label : 'Account',     value: 'Account'},
        {label : 'Contact',     value: 'Contact'},
        {label : 'Opportunity', value: 'Opportunity'},
        {label : 'Products',    value: 'Product'},
    ]

    handleNext(event){
        event.preventDefault();
        this.prepareCurrentStep(event);
    }

    handlePrevious(event){
        event.preventDefault();
        this.prepareCurrentStep(event);
    }

    prepareCurrentStep(event){

        this.showContact     = event.detail.showContact;
        this.showAccount     = event.detail.showAccount;
        this.showOpportunity = event.detail.showOpportunity;
        this.showProduct     = event.detail.showProduct;

        if(this.showContact){
            this.currentStep = 'Contact';
        }else if(this.showAccount){
            this.currentStep = 'Account';
        }else if(this.showOpportunity){
            this.currentStep = 'Opportunity';
        }else{
            this.currentStep = 'Product';
        }
    }
}