import { LightningElement, track } from 'lwc';
import searchUser from '@salesforce/apex/UserSearchController.searchUser';
import { NavigationMixin } from 'lightning/navigation';
const DEFAULT_TIMEOUT = 1000;
export default class Usersearchcomponent extends NavigationMixin(LightningElement) {

    @track records;
    @track errors;

    timer;

    showSpinner = false;

    handleUseChange(event) {
        let searchTerm = event.target.value;
        this.timer = setTimeout(() => {
            console.log(searchTerm);
            this.searchUserFromApex(searchTerm);
        }, DEFAULT_TIMEOUT);
    }

    disconnectedCallback() {
        clearTimeout(this.timer);
    }

    searchUserFromApex(searchText) {
        this.showSpinner = true;
        searchUser({
            searchTerm: searchText
        })
            .then((result) => {
                console.log(result);
                this.records = result;
            })
            .catch((error) => {
                console.error(error);
                this.errors = error;
            })
            .finally(() => {
                console.log(`Finally Executed`);
                this.showSpinner = false;
            })
    }

    handleUserDetail(event) {
        let userId = event.currentTarget.dataset.userId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: `${userId}`,
                objectApiName: "User"
            }
        });
    }
}