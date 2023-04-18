import { LightningElement, api, track, wire } from 'lwc';
import listLineItems from '@salesforce/apex/AddProductsService.queryLineItemRecords';
import getPriceBook from '@salesforce/apex/AddProductsService.fetchPriceBookId';

import getPriceBookEntries from '@salesforce/apex/AddProductsService.getPriceBookEntries';
import submitProducts from '@salesforce/apex/AddProductsService.submitProducts';

import { deleteRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import listLineItem from '@salesforce/apex/AddProductsService.listLineItems';

export default class AddProducts extends LightningElement {

    @api recordId;
    @api objectApiName;
    @track records = [];

    fields = ["Name", "ProductCode", "Family"];
    displayFields = 'Name, ProductCode, Family';

    query = '';
    priceBookQuery = '';
    isLoading = false;
    showModal = false;
    priceBook2Id;
    errorMessage;

    priceBookEntryMap = {};
    objectApiNameMap = {
        'Opportunity': 'OpportunityId',
        'Order': 'OrderId',
        'Quote': 'QuoteId'
    }

    connectedCallback() {
        this.isLoading = true;
        this.priceBookQuery = `SELECT PriceBook2Id FROM ${this.objectApiName} WHERE Id = '${this.recordId}' LIMIT 1`;
        if (this.objectApiName === 'Opportunity') {
            this.query = `SELECT Id, OpportunityId, SortOrder, PricebookEntryId, Product2Id, ProductCode, 
                Name, Quantity, TotalPrice, UnitPrice, ListPrice, ServiceDate, Description,
                Product2.Name
                FROM OpportunityLineItem
                WHERE OpportunityId = '${this.recordId}'
            `;
        } else if (this.objectApiName === 'Order') {
            this.query = `SSELECT Id, Product2Id, OrderId, PricebookEntryId, 
                Quantity, UnitPrice, ListPrice, 
                Product2.Name,
                TotalPrice, ServiceDate, Description FROM OrderItem
                WHERE OrderId = '${this.recordId}'
            `;
        } else if (this.objectApiName === 'Quote') {
            this.query = `SELECT Id, LineNumber, QuoteId, 
                PricebookEntryId, Quantity, UnitPrice, 
                Product2.Name,
                Description, ServiceDate, Product2Id, ListPrice, TotalPrice FROM QuoteLineItem
                WHERE QuoteId = '${this.recordId}'
            `;
        }
        console.log(this.query);
    }

    @wire(getPriceBook, {
        query: '$priceBookQuery'
    })
    wiredPriceBook({ error, data }) {
        if (data) {
            console.log('Pricebook Record ', data);
            if (data.length && data.length > 0) {
                console.log('Pricebook ', data[0]);
                this.priceBook2Id = data[0].Pricebook2Id;
                console.log(this.priceBook2Id);
                if (this.priceBook2Id) {
                    this.showModal = false;
                } else {
                    this.showModal = true;
                }
            } else {
                this.showModal = true;
            }

        }
        if (error) {
            console.error('Error While fetching the pricebook record id from ', this.objectApiName, error);
        }
    }

    @wire(getPriceBookEntries, {
        priceBook2Id: '$priceBook2Id'
    })
    wiredEntries({ error, data }) {
        if (data) {
            data.forEach(entry => {
                this.priceBookEntryMap[entry.Product2Id] = entry.Id;
            });
        }
        if (error) {

        }
    }

    @wire(listLineItems, {
        query: '$query'
    })
    wiredLineItems({ error, data }) {
        if (data) {
            console.log(data);
            this.records = JSON.parse(JSON.stringify(data));
        }
        if (error) {
            console.error(error);
        }
        this.isLoading = false;
        this.addRow();
    }

    handleLookup(event) {
        let detail = event.detail;
        this.records[detail.data.index][detail.data.parentAPIName] = detail.data.recordId;
        console.log(JSON.stringify(this.records));
    }

    addRow() {
        this.records.push({
            Quantity: null,
            Description: '',
            UnitPrice: null,
            ServiceDate: null
        });
    }

    handleRemove(event) {
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let recordId = event.currentTarget.dataset.recordId;
        if (recordId) {
            this.isLoading = true;
            // delete the record from salesforce
            deleteRecord(recordId)
                .then(() => {
                    this.records.splice(index, 1);
                })
                .catch((error) => {
                    console.error('Error while deleting the record ', error);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        } else {
            this.records.splice(index, 1);
        }
    }

    handleDetailPage(event) {
        event.preventDefault();
        let recordId = event.currentTarget.dataset.recordId;
        if (recordId) {
            let recordUrl = 'https://' + location.host + '/lightning/r/' + this.objectApiName + '/' + recordId + '/view';
            location.href = recordUrl;
        }
    }

    handleChange(event) {
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let name = event.currentTarget.name;
        let value = event.currentTarget.value;
        this.records[index][name] = value;
        console.log(this.records);
    }

    handleCancel() {
        this.showModal = false;
    }

    handeChoosePriceBook() {
        this.showModal = true;
    }

    handleSave(event) {
        event.preventDefault();
        this.showModal = false;
        this.priceBook2Id = event.detail.priceBook2Id;
    }

    submitRecords(event) {
        event.preventDefault();
        // Call the apex method to save the record
        // upsert (Update + Insert) based on recordId(Id)

        let allValid = this.validateInput();
        if (!allValid) {
            return;
        }

        // Lookup Validation
        console.log(JSON.stringify(this.records));
        this.records.forEach(line => {
            if (!line.Product2Id && !line.Id) {
                allValid = false;
                this.errorMessage = 'Please select the product for all the line items!';
            }
        });
        if (!allValid) {
            return;
        }

        this.isLoading = true;

        this.records.forEach(line => {
            if (!line.Id) {
                line.PricebookEntryId = this.priceBookEntryMap[line.Product2Id];
                let parentApiName = this.objectApiNameMap[this.objectApiName];
                line[parentApiName] = this.recordId;
                line.Product2Id = undefined;
            }
        });
        console.log(JSON.stringify(this.records));

        submitProducts({
            objectApiName: this.objectApiName,
            records: JSON.stringify(this.records)
        })
            .then((result) => {
                let successEvent = new ShowToastEvent({
                    title: 'Success',
                    message: 'Record Saved!',
                    variant: 'success'
                });
                this.dispatchEvent(successEvent);

                listLineItem({
                    query: this.query
                })
                    .then((result) => {
                        this.records = JSON.parse(JSON.stringify(result));
                        this.addRow();
                    }).
                    catch((error) => {
                        this.errorMessage = JSON.stringify(erorr);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });

            })
            .catch((erorr) => {
                console.error('Error while adding the products ', erorr);
                let errorEvent = new ShowToastEvent({
                    title: 'Error!',
                    message: JSON.stringify(erorr),
                    variant: 'error'
                });
                this.dispatchEvent(errorEvent);
                this.errorMessage = JSON.stringify(erorr);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    validateInput() {
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }
}