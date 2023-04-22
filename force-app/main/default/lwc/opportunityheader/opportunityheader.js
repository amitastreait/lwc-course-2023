import { LightningElement, api, wire } from 'lwc';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import ACCOUNTNAME_FIELD from '@salesforce/schema/Opportunity.Account.Name';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';

export default class Opportunityheader extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [ID_FIELD, NAME_FIELD, STAGE_FIELD, AMOUNT_FIELD, CLOSEDDATE_FIELD, ACCOUNTNAME_FIELD, ACCOUNTID_FIELD] })
    opportunity;

    get opportunityUrl() {
        let baseUrl = 'https://' + location.host + '/lightning/r/Opportunity/';
        if (this.opportunity && this.opportunity.data) {
            baseUrl += this.opportunity.data.id + '/view';
        }
        return baseUrl;
    }

    get name() {
        return getFieldValue(this.opportunity.data, NAME_FIELD);
    }

    get stage() {
        return getFieldValue(this.opportunity.data, STAGE_FIELD);
    }

    get amount() {
        let amount = 0;
        if (this.opportunity && this.opportunity.data) {
            amount = this.opportunity.data.fields.Amount.displayValue;
        }
        //return getFieldValue(this.opportunity.data, AMOUNT_FIELD);
        return amount;
    }

    get closedDate() {
        return getFieldValue(this.opportunity.data, CLOSEDDATE_FIELD);
    }

    get account() {
        return getFieldValue(this.opportunity.data, ACCOUNTNAME_FIELD);
    }

    get accountId() {
        let baseUrl = 'https://' + location.host + '/lightning/r/Account/';
        if (this.opportunity && this.opportunity.data) {
            baseUrl += this.opportunity.data.fields.AccountId.value + '/view';
        }
        return baseUrl;
    }

}