import { LightningElement, track } from 'lwc';
import tailwind from '@salesforce/resourceUrl/tailwind';
import { loadStyle } from 'lightning/platformResourceLoader';
import searchUser from '@salesforce/apex/AnynomousClass.searchUser';
import { NavigationMixin } from 'lightning/navigation';
const DEFAULT_TIMEOUT = 1000;

export default class Profile extends NavigationMixin(LightningElement) {

    timer;
    @track records;
    @track errors;

    connectedCallback() {
        Promise.all([
            loadStyle(this, tailwind)
        ]).then(() => {

        })
            .catch((error) => {
                console.log(' Error => ', error);
            });
    }

    disconnectedCallback() {
        clearTimeout(this.timer);
    }

    handleInputChange = (event) => {
        event.preventDefault();
        let searchText = event.target.value;
        this.timer = setTimeout(() => {
            this.handleSearchUser(searchText);
        }, DEFAULT_TIMEOUT);
    }

    handleSearchUser(inputTerm) {
        searchUser({
            searchText: inputTerm
        })
            .then(result => {
                console.log(result);
                this.records = result;
            })
            .catch(error => {
                this.errors = error;
            });
    }

    handleDetailPage = (event) => {
        event.preventDefault();
        let userId = event.currentTarget.dataset.userId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: userId,
                objectApiName: "User"
            }
        });
    }

}