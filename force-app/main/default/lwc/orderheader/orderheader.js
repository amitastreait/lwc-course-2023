import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Order.Id';
import AMOUNT_FIELD from '@salesforce/schema/Order.TotalAmount';
import ACCOUNTNAME_FIELD from '@salesforce/schema/Order.Account.Name';
import ACCOUNTID_FIELD from '@salesforce/schema/Order.AccountId';
import ORDERNUMBER_FIELD from '@salesforce/schema/Order.OrderNumber';
import Status_FIELD from '@salesforce/schema/Order.Status';
import ORDERDATE_FIELD from '@salesforce/schema/Order.CreatedDate';

export default class Orderheader extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [ID_FIELD, Status_FIELD, ORDERNUMBER_FIELD, AMOUNT_FIELD, ACCOUNTNAME_FIELD, ACCOUNTID_FIELD, ORDERDATE_FIELD] })
    order;

    get orderUrl() {
        let baseUrl = 'https://' + location.host + '/lightning/r/Order/';
        if (this.order && this.order.data) {
            baseUrl += this.order.data.id + '/view';
        }
        return baseUrl;
    }

    get number() {
        return getFieldValue(this.order.data, ORDERNUMBER_FIELD);
    }

    get account() {
        return getFieldValue(this.order.data, ACCOUNTNAME_FIELD);
    }

    get accountId() {
        let baseUrl = 'https://' + location.host + '/lightning/r/Account/';
        if (this.order && this.order.data) {
            baseUrl += this.order.data.fields.AccountId.value + '/view';
        }
        return baseUrl;
    }

    get amount() {
        let amount = 0;
        if (this.order && this.order.data) {
            amount = this.order.data.fields.TotalAmount.displayValue;
        }
        return amount;
    }

    get status() {
        return getFieldValue(this.order.data, Status_FIELD);
    }

    get orderDate() {
        return getFieldValue(this.order.data, ORDERDATE_FIELD);
    }
}