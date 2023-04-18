import { LightningElement, track, wire } from 'lwc';
import fetchToDoList from '@salesforce/apex/ReminderService.fetchToDoList';
import fetchPicklistValues from '@salesforce/apex/ReminderService.fetchPicklistValues';
import { NavigationMixin } from 'lightning/navigation';

export default class Reminder extends NavigationMixin(LightningElement) {

    @track toDoList = [];
    @track allToDoList = [];
    @track errors;
    @track selectedRecord;
    @track selectedEditRecord;

    @track statusOptions = [];
    @track priorityOptions = [];

    @track filters = {
        Subject: '',
        Status: '',
        Priority: ''
    }

    showModal = false;
    editModal = false;

    @wire(fetchPicklistValues, {
        objectApiName: "Task",
        fieldApiName: "Status"
    })
    wiredStatusValues({ error, data }) {
        if (data) {
            this.statusOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    @wire(fetchPicklistValues, {
        objectApiName: "Task",
        fieldApiName: "Priority"
    })
    wiredPriorityValues({ error, data }) {
        if (data) {
            this.priorityOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    connectedCallback() {
        this.fetechTodos();
    }

    /* @wire(fetchToDoList)
    wiredReminders({ error, data }) {
        if (data) {
            //this.toDoList = data;
            let currentDate = new Date();
            this.toDoList = data.map(todo => {
                let activityDate = todo.ActivityDate;
                let activityDateConverted = new Date(activityDate);
                return {
                    ...todo,
                    headingStyle: currentDate > activityDateConverted ? 'color:red;' : ''
                };
            });
        }
        if (error) {
            this.errors = error;
            console.error('Error while fetching the TODO List Records ', error);
        }
    }*/

    fetechTodos() {
        fetchToDoList()
            .then((data) => {
                //this.toDoList = data;
                let currentDate = new Date();
                this.toDoList = data.map(todo => {
                    let activityDate = todo.ActivityDate;
                    let activityDateConverted = new Date(activityDate);
                    return {
                        ...todo,
                        headingStyle: currentDate > activityDateConverted ? 'color:red;' : ''
                    };
                });
                this.allToDoList = this.toDoList;
            })
            .catch((error) => {
                this.errors = error;
                console.error('Error while fetching the TODO List Records ', error);
            })
            .finally(() => {

            })
    }

    handleClick() {
        this.showModal = true;
    }
    handleCancel() {
        this.showModal = false;
        this.selectedRecord = undefined;
        this.editModal = false;
    }

    handleSuccess() {
        this.showModal = false;
        this.selectedRecord = undefined;
        this.editModal = false;
        this.fetechTodos();
    }

    handleRecordPage(event) {
        event.preventDefault();
        let recordId = event.currentTarget.dataset.recordId;
        /*
        this.toDoList.forEach(todo => {
            if (recordId === todo.Id) {
                this.selectedRecord = todo;
            }
        });
        */

        this.selectedRecord = this.toDoList.find((todo) => {
            return recordId === todo.Id;
        });

        // array.find
        /* this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: recordId,
                objectApiName: "Task"
            }
        });*/
    }

    handleRecordEditPage(event) {
        event.preventDefault();
        let recordId = event.currentTarget.dataset.recordId;
        this.editModal = true;

        this.selectedEditRecord = this.toDoList.find((todo) => {
            return recordId === todo.Id;
        });

    }


    handleChange(event) {
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        this.filters[name] = value;
        this.handleApplyFilter();
    }
    handleClearFilter(event) {
        event.preventDefault();
        this.filters = {
            Subject: '',
            Status: '',
            Priotity: ''
        }
        this.toDoList = this.allToDoList;
    }
    handleApplyFilter() {
        this.toDoList = this.allToDoList;
        if (this.filters.Subject) {
            this.toDoList = this.allToDoList.filter(item => {
                return item.Subject.toLowerCase().includes(this.filters.Subject.toLocaleLowerCase());
            });
        }
        if (this.filters.Status) {
            this.toDoList = this.toDoList.filter(item => {
                return item.Status === this.filters.Status;
            });
        }
        if (this.filters.Priority) {
            this.toDoList = this.toDoList.filter(item => {
                return item.Priority === this.filters.Priority;
            });
        }
    }

}