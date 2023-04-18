import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    opportunityId;
    accountId;

    get inputVariables() {
        return [
            {
                // Match with the input variable name declared in the flow.
                name: 'OpportunityID',
                type: 'String',
                // Initial value to send to the flow input.
                value: 'this.opportunityId'
            },
            {
                // Match with the input variable name declared in the flow.
                name: 'AccountID',
                type: 'String',
                // Initial value to send to the flow input.
                value: 'this.accountId'
            }
        ];
    }

    handleStatusChange(event) {
        const outputVariables = event.detail.outputVariables;
        if (event.detail.status === 'FINISHED') {
            console.log('Flow Finished');
            console.log('outputVariables \n ', outputVariables);
            console.log('outputVariables \n ', JSON.stringify(event.detail));
        }
    }
}