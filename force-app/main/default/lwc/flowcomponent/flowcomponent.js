import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class Flowcomponent extends NavigationMixin(LightningElement) {

    handleStatusChange(event) {
        let details = event.detail;
        if (details.status === 'FINISHED') {
            let outputVariables = details.outputVariables;
            if (outputVariables) {
                let accountId = outputVariables[0].value;
                console.log(accountId);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        actionName: "view",
                        recordId: accountId
                    }
                });
            }
        }
    }

    get inpurVariables() {
        return [
            {
                name: 'accountId',
                type: 'String',
                value: 'Value from LWC'
            },
        ]
    }
}