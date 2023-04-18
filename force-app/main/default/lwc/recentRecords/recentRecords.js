import   { api, LightningElement, wire } from 'lwc';
import   getAllObjects from '@salesforce/apex/MyObjectList.getAllObjects';
import   getPicklistFields from '@salesforce/apex/MyObjectList.getPicklistFields';
import   getInitData from '@salesforce/apex/MyObjectList.getInitData';
import   { NavigationMixin } from 'lightning/navigation';
import   { updateRecord } from 'lightning/uiRecordApi';
import   { ShowToastEvent } from 'lightning/platformShowToastEvent';

const objectSet = new Set();
objectSet.add('Case');
objectSet.add('Order');
objectSet.add('Contract');
objectSet.add('WorkOrder');

export default class RecentRecords extends NavigationMixin(LightningElement) {

    @api objectApiName;
    @api noOfRecords = '5';

    _objects;
    _fields;
    _errors;
    isSpinner = false;

    _columns = [];
    _records;
    draftValues = [];
    _filteredRecord;
    returnedRecord;

    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy = 'Name';

    @wire(getAllObjects)
    wiredData({ error, data }) {
        if (data) {
            this._objects = data;
        } else if (error) {
            this._errors = error;
        }
    }

    @wire(getPicklistFields, { objectName: '$objectApiName' })
    wiredDataPicklist({ error, data }) {
        if (data) {
            this._fields = data;
        } else if (error) {
            console.error('Error: \n ', error);
            this._errors = error;
        }
    }

    get items(){
        let options = [];
        if(this._objects){
            this._objects.forEach(object => {
                let objectValues = object.split('####');
                options.push({
                    label: objectValues[0],
                    value: objectValues[1]
                })
            });
        }
        return options.sort();
    }

    get options(){
        let options = [];
        if(this._fields){
            this._fields.forEach(object => {
                let objectValues = object.split('####');
                options.push({
                    label: objectValues[0],
                    value: objectValues[1]
                })
            });
        }
        return options;
    }

    handleChange = event => {
        event.preventDefault();
        let value = event.target.value;
        let name = event.target.name;
        if(name !== 'NoOfRecords'){
            this.objectApiName = value;
            this._records = undefined;
            this._filteredRecord = undefined;

        }else{
            this.noOfRecords = value;
        }
    }

    handleSearch = event => {
        this._errors = undefined;
        event.preventDefault();
        this.isSpinner = true;
        getInitData({ 
            objectApiName : this.objectApiName,
            limitRecords  : this.noOfRecords
        })
        .then(result => {
            let recordList;
            let action = {
                type: "button",
                typeAttributes: {
                    label: 'Edit',
                    initialWidth: 10,
                    name: 'Edit',
                    title: 'Edit',
                    disabled: {
                        fieldName: 'hasEditAccess'
                    },
                    value: 'edit'
                }
            }
            let viewAction = {
                type: "button",
                typeAttributes: {
                    label: 'View',
                    initialWidth: 10,
                    name: 'View',
                    title: 'View',
                    value: 'View'
                }
            }
            let columnList = JSON.parse( JSON.stringify(result.fieldsWrappersList) );
            columnList.push(action);
            columnList.push(viewAction);
            this._columns = columnList;
            result.dataList.forEach(record => {
                let sRecord = JSON.parse( JSON.stringify(record) );
                sRecord.hasEditAccess = !sRecord.hasEditAccess;
                if(!recordList){
                    recordList = [];
                }
                recordList.push(sRecord);
            });
            this._records = recordList;
            this._filteredRecord = this._records;
            this.returnedRecord  = this._filteredRecord === undefined ? 0 : this._filteredRecord.length;
            console.log('OUTPUT : ', result );
        })
        .catch(error => {
            console.error('Error: \n ', error);
            this._errors = error;
        })
        .finally(()=>{
            this.isSpinner = false;
        })
    }

    handleRowAction = event => {
        event.preventDefault();
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'Edit':
                this.editRecord(row.Id);
                break;
            case 'View':
                this.viewRecord(row.Id);
                break;
            default:
        }
    }

    viewRecord = recordId => {
        let baseUrl = 'https://'+location.host+'/'+recordId;
        window.open(baseUrl, '_blank');
    }
    editRecord = recordId => {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "edit",
                recordId: recordId
            }
        });
    }

    handleSave(event) {
        
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        this.isLoading = true;
        
        Promise.all(promises).then(record => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Record updated',
                    variant: 'success'
                })
            );
            this.draftValues = [];
        }).catch(error => {
            console.error(' Error Occured While Uploading Records ', error);
        })
        .finally( () => {
            this.isLoading = false;
        });
    }

    
    handleTextChange(event){
        let _searchVar  = event.detail.value;
        let _dataList   = this._records;
        let _filterList = [];
        if(_searchVar){
            _filterList = this.arrayContainsValue(_dataList,_searchVar);
        }else{
            _filterList = this._records;
        }
        this._filteredRecord = _filterList;
    }
    arrayContainsValue(arr, val){
        var records=[];
        var _regex = new RegExp(val, "i");
        for (var i = 0; i < arr.length; i++) {
            for (var key in arr[i]){
                if( arr[i][key].search( _regex ) !== -1 ){
                    records.push(arr[i]);
                    break;
                }
            }
        }
        return records;
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this._filteredRecord];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this._filteredRecord = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}