
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues, decodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class NavToNewRecordWithDefaults extends NavigationMixin(LightningElement) {

    navigateToNewContactWithDefaults() {
        
        let defaultValuesWithKey = {
            FirstName: 'SFDC',
            LastName: 'Panther',
            Email : 'info@sfdcpanther.com',
            LeadSource: 'Other',
            Phone : '9087654321',
            Fax : '9087654321'
        };

        const defaultValues = encodeDefaultFieldValues(defaultValuesWithKey);
        console.log('defaultValues \n ', defaultValues);

        const defaultValuesDecode = decodeDefaultFieldValues(defaultValues);
        console.log('defaultValuesDecode \n ', defaultValuesDecode);

        let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

}