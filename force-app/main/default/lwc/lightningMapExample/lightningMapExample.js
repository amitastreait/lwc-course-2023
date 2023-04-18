import { LightningElement, track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/DataTableController.getAccountList';

export default class LightningMapExample extends LightningElement {

    @track mapMarkers;

    @wire(getAccountList)
    wiredData({ error, data }) {
        if (data) {
            data.forEach(account => {
                let mapObj = {
                    location : {
                        City        : account.ShippingCountry,
                        Country     : account.ShippingCity,
                        PostalCode  : account.ShippingPostalCode,
                        State       : account.ShippingState,
                        Street      : account.ShippingStreet
                    },
                    value           : account.Name,
                    title           : account.Name,
                    description     : account.Description,
                    icon            : 'standard:account'
                }
                if(!this.mapMarkers){
                    this.mapMarkers = [];
                }
                this.mapMarkers.push(mapObj);
            });
            window.console.log(' this.mapMarkers \n ', this.mapMarkers)
        } else if (error) {
            console.error('Error:', error);
        }
    }

    handleMarkerSelect(event) {
        alert(event.target.selectedMarkerValue);
    }
}