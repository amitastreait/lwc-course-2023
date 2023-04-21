import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import searchProduct from '@salesforce/apex/SearchProductService.searchProduct'

const columns = [
    {
        label: 'Name', fieldName: 'Name', type: 'link', typeAttributes: {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            }
        }
    },
    { label: 'Product Family', fieldName: 'Family' },
    { label: 'Product Code', fieldName: 'ProductCode' },
    { label: 'Description', fieldName: 'Description' },
    { label: 'Active ?', fieldName: 'IsActive' }
];

export default class SearchProduct extends LightningModal {

    @api content;
    @api priceBook2Id;
    @api index;

    isSpinner = false;
    @track records;
    @track errors;

    @track columnList = columns;

    handleCancel() {
        this.close('cancel');
    }

    handleClick() {
        this.close('okay');
    }

    connectedCallback() {
        if (this.content) {
            this.handleClick(this.content);
        }
    }

    handleChange(event) {
        event.preventDefault();
        let searchKeyword = event.target.value;
        this.handleClick(searchKeyword);
    }

    handleClick(searchKeyword) {
        this.isSpinner = true;
        searchProduct({
            searchKeywrod: searchKeyword,
            priceBook2Id: this.priceBook2Id
        })
            .then((result) => {
                this.records = result;
                this.records = result.map(itme => {
                    return {
                        ...item,
                        Family: item.Product2.Family,
                        ProductCode: item.Product2.ProductCode,
                        Description: item.Product2.Description,
                    }
                });
            })
            .catch((error) => {
                this.errors = error;
            })
            .finally(() => {
                this.isSpinner = false;
            });
    }

    handleLinkClick(event) {
        event.preventDefault();
        let details = event.detail;
        let clonedDetails = JSON.parse(JSON.stringify(details));
        clonedDetails.index = this.index;
        this.close(JSON.stringify(clonedDetails));
    }
}