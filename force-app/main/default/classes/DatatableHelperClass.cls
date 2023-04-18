public with sharing class DatatableHelperClass {

    public static final String NAME_STRING   = 'Name';
    public static final String URL_TYPE_NAME = 'url';

    public static List<Schema.FieldSetMember> getFieldSetMembers(String objApiName, String fieldSetName) {
        FieldSet currentFieldSet = Schema.getGlobalDescribe().get(objApiName).getDescribe().fieldSets.getMap().get(fieldSetName);
        if (null == currentFieldSet) {
            throw new AuraHandledException(objApiName + ' Field Set "' + fieldSetName + '" is not found');
        }
        return currentFieldSet.getFields();
    }

    public static DataTableFieldsWrapper getFieldWrapper(Schema.FieldSetMember field) {
        DataTableFieldsWrapper newWrapper = new DataTableFieldsWrapper();
        newWrapper.label     = field.getLabel();
        newWrapper.fieldName = field.getFieldPath();
        newWrapper.type = field.getType().name().toLowerCase();
        newWrapper.sortable = true;
        newWrapper.editable = false;
        newWrapper.wrapText = true;
        if ('double' == newWrapper.type) {
            newWrapper.type = 'number';
        }
        if ('datetime' == newWrapper.type) {
            newWrapper.type = 'date';
            newWrapper = setDateAttributes(newWrapper, false);
        }
        if(newWrapper.label.endsWithIgnoreCase('id')){
            newWrapper.label = newWrapper.label.removeEndIgnoreCase('id').trim();
        }
        Boolean isReference = 'reference' == newWrapper.type;
        if (isReference) {
            //newWrapper.type = 'text';
            newWrapper.editable = false;
            newWrapper.fieldName = getFieldName(newWrapper.fieldName);
            typeAttributes attributes = new typeAttributes();
            Map<String, String> labelMap = new Map<String, String>();
            attributes.target = '_blank';
            labelMap.put('fieldName', newWrapper.fieldName);
            newWrapper.typeAttributes = attributes;
        }
        return newWrapper;
    }

    public static String getFieldName(String fieldName) {
        String newFieldName = fieldName;
        if (fieldName.equalsIgnoreCase('Id')) {
            newFieldName = NAME_STRING;
        }else if (fieldName.endsWithIgnoreCase(NAME_STRING)) {
            newFieldName = fieldName.removeEndIgnoreCase(NAME_STRING) + 'Id';
        }else if (fieldName.endsWithIgnoreCase('id')) {
            newFieldName = fieldName.removeEndIgnoreCase('id') + '.Name';
        }else if (fieldName.endsWithIgnoreCase('__c')) {
            newFieldName = fieldName.removeEndIgnoreCase('c') + 'r.Name';
        }
        return newFieldName;
    }

    public static DataTableFieldsWrapper setDateAttributes(DataTableFieldsWrapper newWrapper, Boolean showDateAsNumeric){
        if (showDateAsNumeric) {
            newWrapper.typeAttributes = new TypeAttributes();
            newWrapper.typeAttributes.day = 'numeric';
            newWrapper.typeAttributes.month = 'numeric';
            newWrapper.typeAttributes.year = 'numeric';
        }
        return newWrapper;
    }

    public static List<Map<String, Object>> getFieldValues(List<SObject> resultList, List<DataTableFieldsWrapper> fieldsWrappersList, Map<Id, Boolean> recordAccessMap) {
        List<Map<String, Object>> fieldValuesMapList = new List<Map<String, Object>>();
        Map<String, Object> fieldValuesMap;
        String name, newName;
        Object value;
        for (SObject record : resultList) {
            fieldValuesMap = new Map<String, Object>();
            Id recordId = (Id)record.get('Id');
            fieldValuesMap.put('hasEditAccess', false);
            if(recordAccessMap.containsKey( recordId )){
                fieldValuesMap.put('hasEditAccess', recordAccessMap.get( recordId ) );
            }
            for (DataTableFieldsWrapper fieldWrapper : fieldsWrappersList) {
                name = fieldWrapper.fieldName;
                Boolean isLink = false;
                if(fieldWrapper.type == 'reference'){
                    isLink = true;
                }
                value = findFieldValue(name, record, isLink);
                fieldValuesMap.put(name, value);
            }
            if (!fieldValuesMap.containsKey('Id')) {
                fieldValuesMap.put('Id', record.get('Id'));
            }
            fieldValuesMapList.add(fieldValuesMap);
        }
        return fieldValuesMapList;
    }

    public static Object findFieldValue(String name, SObject record, Boolean prepareLink) {
        Object value;
        if (name.contains('.')) {
            List<String> sObjectsList = name.split('\\.');
            for (Integer i = 0; i < sObjectsList.size() - 1; i++) {
                value = null == value ? record.getSObject(sObjectsList[i]) : ((SObject)value).getSObject(sObjectsList[i]);
                if (null == value) {
                    return null;
                }
            }
            value = ((SObject)value).get(sObjectsList[sObjectsList.size() - 1]);
        } else {
            value = record.get(name);
        }
        return null == value ? null : prepareLink ? '/' + value : value;
    }

    public class DataTableFieldsWrapper {
        @AuraEnabled
        public String label { get; set; }
        @AuraEnabled
        public String fieldName { get; set; }
        @AuraEnabled
        public String type { get; set; }
        @AuraEnabled
        public Boolean sortable { get; set; }
        @AuraEnabled
        public Boolean editable { get; set; }
        @AuraEnabled
        public Boolean wrapText { get; set; }
        @AuraEnabled
        public TypeAttributes typeAttributes { get; set; }
    }

    public class TypeAttributes {
        @AuraEnabled
        public String day { get; set; }
        @AuraEnabled
        public String month { get; set; }
        @AuraEnabled
        public String year { get; set; }
        @AuraEnabled
        public Map<String, String> label { get; set; }
        @AuraEnabled
        public String target { get; set; }
        @AuraEnabled
        public List<Map<String, String>> rowActions { get; set; }
    }

    public class DataTableResponseWrapper {
        @AuraEnabled
        public List<DataTableFieldsWrapper> fieldsWrappersList { get; set; }
        @AuraEnabled
        public List<DataTableDataWrapper> dataListWarpper      { get; set; }
        @AuraEnabled
        public List<Object> dataList                           { get; set; }
        public DataTableResponseWrapper(){
            fieldsWrappersList = new List<DataTableFieldsWrapper>();
            dataListWarpper    = new List<DataTableDataWrapper>();
            dataList           = new List<Object>();
        }
    }

    public class DataTableDataWrapper {
        @AuraEnabled
        public SObject sObjectRecord { get; set; }
        @AuraEnabled
        public Boolean hasEditAccess { get; set; }
    }
}
