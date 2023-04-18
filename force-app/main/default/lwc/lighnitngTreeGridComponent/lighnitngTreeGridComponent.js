import { LightningElement, track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountTreeGridController.getAccountList';

import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'Edit', name: 'edit_record' },
    { label: 'View', name: 'view_record' }
];

const  columns = [
    { label: 'Name',   fieldName: 'Name',   type: 'text', wrapText : true },
    { label: 'Type',   fieldName: 'Type',   type: 'text' },
    { label: 'Phone',  fieldName: 'Phone',  type: 'phone' },
    { label: 'Email',  fieldName: 'Email',  type: 'email' },
    { 
        type: 'action',
        label: 'Edit Record',
        typeAttributes: { 
            rowActions: actions,
            menuAlignment: 'right' 
        } 
    }
];


export default class LighnitngTreeGridComponent extends NavigationMixin(LightningElement) {

    @track treeGridData;
    _errors;
    isSpinner = false;
    gridColumns = columns;

    @wire(getAccountList)
    wiredData({ error, data }) {
        if (data) {
            let parsedData = JSON.parse(JSON.stringify(data));
            /*parsedData.map( (row, index) => {
                if (row['Contacts']) {
                    row._children = row['Contacts']; //define rows with children 
                    delete row.Contacts;
                }
            });*/
            parsedData.forEach(account => {
                if(account.Contacts){
                    account._children = account.Contacts;
                    delete account.Contacts;
                }   
            });
            if(!this.treeGridData){
                this.treeGridData = [];
            }
            this.treeGridData = parsedData;
            window.console.log('tree \n ', this.treeGridData );
        } else if (error) {
            console.error('Error: \n ', error);
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'view_record':
                this[NavigationMixin.Navigate]({
                    type: 'standard__objectPage',
                    attributes: {
                        actionName: 'view',
                        recordId: row.Id
                    }
                });
                break;
            case 'edit_record':
                this[NavigationMixin.Navigate]({
                    type: 'standard__objectPage',
                    attributes: {
                        objectApiName: 'Contact',
                        actionName: 'edit',
                        recordId: row.Id
                    }
                });
                break;
        }
    }
    
}