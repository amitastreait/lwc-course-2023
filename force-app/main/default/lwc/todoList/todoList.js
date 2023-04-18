import { LightningElement, track, wire } from 'lwc';
import fetchToDoList from '@salesforce/apex/ReminderService.fetchToDoList';

export default class TodoList extends LightningElement {

    @track todoList = [];
    @track errors;

    showModal = false;

    @wire(fetchToDoList)
    wiredToDoList({ error, data }) {
        if (data) {
            let currentDate = new Date();
            this.todoList = data.map(item => {
                let activityDate = item.ActivityDate;
                activityDate = new Date(activityDate);
                return {
                    ...item,
                    headingClass: (currentDate > activityDate) ? 'heading-container slds-text-heading_medium due-class' : 'heading-container slds-text-heading_medium'
                };
            });
            console.log(this.todoList);
        }
        if (error) {
            this.errors = error;
            console.error('Error Occured while fetching the TODO List ', error);
        }
    }

    handleClick() {
        this.showModal = true;
    }

    handleCancel() {
        this.showModal = false;
    }

    handleSuccess(event) {
        this.showModal = false;
    }

}