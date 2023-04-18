import { LightningElement, track, wire } from 'lwc';
import listAccount from '@salesforce/apex/AccountService.listAccounts';

const columns = [
    {
        label: 'Link', fieldName: 'Name', type: 'link',
        typeAttributes: {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            },
        }
    },
    { label: 'Id', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    {
        label: 'Image', fieldName: 'imageUrl', type: 'image',
        typeAttributes: {
            height: 50,
            width: 50,
            alt: 'Panther School Image'
        }
    },
    {
        label: 'Industry', fieldName: 'Industry', type: 'picklist', wrapText: true,
        typeAttributes: {
            name: 'Industry',
            label: 'Industry',
            placeholder: 'Select Industry',
            index: 0,
            variant: 'label-hidden',
            options: [
                { label: 'Education', value: 'Education' },
                { label: 'Banking', value: 'Banking' },
                { label: 'Aparel', value: 'Aparel' },
                { label: 'Technology', value: 'Technology' }
            ]
        }
    }
];
export default class Datatable extends LightningElement {

    @track dataList = [];
    @track columnsList = columns;
    @track errors;

    @wire(listAccount)
    wiredAccounts({ error, data }) {
        if (data) {
            this.dataList = data.map(item => {
                return {
                    ...item,
                    imageUrl: 'https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png'
                };
            });
        }
        if (error) {
            this.errors = error;
        }
    }

    handleSelect(event) {
        event.preventDefault();
        let detail = event.detail;
        console.log(JSON.stringify(detail));
    }
}