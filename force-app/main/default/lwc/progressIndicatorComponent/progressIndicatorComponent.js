import { api, LightningElement } from 'lwc';

export default class ProgressIndicatorComponent extends LightningElement {
    @api currentStep = 'Contact';

    @api stepValues = [
        {label : 'Account', value: 'Account'},
        {label : 'Contact', value: 'Contact'},
        {label : 'Opportunity', value: 'Opportunity'},
    ]
}