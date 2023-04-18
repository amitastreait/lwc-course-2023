import { LightningElement, track, wire } from 'lwc';
import listAccounts from '@salesforce/apex/AccountService.listAccounts';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    {
        label: 'Link', fieldName: 'Name', type: 'link', typeAttributes: {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            },
        }
    },
    {
        label: 'Industry', fieldName: 'Industry', type: 'picklist', wrapText: true, typeAttributes: {
            name: 'Industry',
            label: 'Industry',
            placeholder: 'Select Industry',
            options: [
                { label: 'Education', value: 'Education' },
                { label: 'Technology', value: 'Technology' },
                { label: 'Banking', value: 'Banking' },
                { label: 'Chemical', value: 'Chemical' },
                { label: 'Aparel', value: 'Aparel' },
                { label: 'IT', value: 'IT' },
            ],
            variant: 'label-hidden'
        }
    },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Type', fieldName: 'Type' },
    {
        label: 'Logo', fieldName: 'IMAGE_URL', type: 'image', typeAttributes: {
            height: 50,
            width: 50,
            alt: 'PantherSchools Logo'
        }
    },
    {
        label: 'Parent', fieldName: 'ParentId', type: 'lookup', typeAttributes: {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            },
            objectName: "Account",
            iconName: "standard:account",
            label: "Parent",
            placeholder: 'Select Parent Account',
            parentApiName: 'ParentId',
            filds: [['Name']],
            displayFields: 'Name, Rating, AccountNumber'
        }
    }
];
export default class Datatabledemo extends LightningElement {
    @track columnList = columns;
    @track records;
    @track errors;

    @wire(listAccounts)
    wiredAccounts({ error, data }) {
        if (data) {

            //this.records = data;
            // IMAGE_URL = 'https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png'
            this.records = data.map(item => {
                return {
                    ...item,
                    IMAGE_URL: 'https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png',
                    ICON_NAME: 'standard:contact',
                }
            })
        }
        if (error) {
            this.errors = error;
            console.log(' error ', JSON.stringify(error))
        }
    }

    handleSelect(event) {
        event.preventDefault();
        console.log('Industry Changed!');
    }

    handleLinkClick(event) {
        event.preventDefault();
        let details = event.detail;
        console.log(JSON.stringify(details));
    }

}