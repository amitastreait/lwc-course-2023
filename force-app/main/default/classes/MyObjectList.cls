public with sharing class MyObjectList extends VisualEditor.DynamicPickList {

    private static final List<String> QUERY_FIELDS = new List<String>{'CreatedBy.Name','CreatedById','CreatedDate','Owner.Name','OwnerId'};
    private static final Map<String, String>  OBJECTS_MAP = new Map<String, String>{
        'Case'=>'CaseNumber','Order'=>'OrderNumber',
        'Contract'=>'ContractNumber', 'WorkOrder' => 'WorkOrderNumber',
        'Event' => 'Subject', 'Task' => 'Subject'
    };
    public override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('Account', 'Account');
        return defaultValue;
    }
    public override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows  myObjectList = new VisualEditor.DynamicPickListRows();
        for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
            Schema.DescribeSObjectResult objectDef = objTyp.getDescribe();
            if( objectDef.getRecordTypeInfos().size() > 0) {
                if(objectDef.isAccessible()){
                    VisualEditor.DataRow value = new VisualEditor.DataRow(objectDef.getName(), objectDef.getLabel());
                    myObjectList.addRow(value);
                }
            }
        }
        return myObjectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getAllObjects(){
        List<String> objects = new List<String>();
        try {
            for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
                Schema.DescribeSObjectResult objectDef = objTyp.getDescribe();
                if( objectDef.getRecordTypeInfos().size() > 0 && objectDef.isAccessible() ) {
                    objects.add( objectDef.getName() + '####'+objectDef.getLabel() );
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return objects;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistFields(String objectName){
        List<String> fieldList = new List<String>();
        if(String.isBlank(objectName)){
            return fieldList;
        }
        try {
            Schema.SObjectType sObjectDescribe = Schema.getGlobalDescribe().get(objectName);
            Schema.DescribeSObjectResult sObjectDescribeResult = sObjectDescribe.getDescribe() ;
            Map<String,Schema.SObjectField> fieldsMap = sObjectDescribeResult.fields.getMap() ;
            for(String field : fieldsMap.keySet() ){
                Schema.DescribeFieldResult fieldResult = fieldsMap.get(field).getDescribe();
                if( fieldResult.isAccessible() && !fieldResult.getLabel().contains('Geocode')){
                    fieldList.add(fieldResult.getLabel()+'####'+fieldResult.getName() + '####'+ fieldResult.getType() );
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return fieldList;
    }

    @AuraEnabled(Cacheable = true)
    public static DatatableHelperClass.DataTableResponseWrapper getInitData(String objectApiName, String limitRecords) {

        List<Object> initData = new List<Object>();
        List<String> fieldsToQuery = new List<String>();
        String fieldSetName = getFieldSetName(objectApiName);
        
        DatatableHelperClass.DataTableResponseWrapper responseWrapper = new DatatableHelperClass.DataTableResponseWrapper();
        
        if(!String.isBlank(fieldSetName)){
            prepareFsColumns(objectApiName, fieldSetName, responseWrapper, fieldsToQuery);
        }else{
            fieldsToQuery.addAll(QUERY_FIELDS);
            String fieldName = OBJECTS_MAP.get(objectApiName) == null ?'Name':OBJECTS_MAP.get(objectApiName);
            DatatableHelperClass.DataTableFieldsWrapper nameWrapper = prepaseNameColumn(fieldName, fieldName, 'text');
            DatatableHelperClass.DataTableFieldsWrapper createdByWrapper = prepaseNameColumn('CreatedBy.Name', 'CreatedBy', 'text');
            DatatableHelperClass.DataTableFieldsWrapper ownerWrapper = prepaseNameColumn('Owner.Name', 'Owner', 'text');
            DatatableHelperClass.DataTableFieldsWrapper createdDateWrapper = prepaseNameColumn('CreatedDate', 'Created Date', 'date');
            responseWrapper.fieldsWrappersList.add(nameWrapper);
            responseWrapper.fieldsWrappersList.add(createdByWrapper);
            responseWrapper.fieldsWrappersList.add(ownerWrapper);
            responseWrapper.fieldsWrappersList.add(createdDateWrapper);
            if(OBJECTS_MAP.containsKey(objectApiName)){
                fieldsToQuery.add(OBJECTS_MAP.get(objectApiName));
            }else{
                fieldsToQuery.add('Name');
            }
        }
        
        String query = 'SELECT '+String.join(fieldsToQuery, ', ')+' FROM '+objectApiName+ 
            ' WITH SECURITY_ENFORCED ORDER BY CreatedDate DESC LIMIT '+limitRecords;

        List<SObject> sobjectRecords = Database.query(query);
        Set<Id> recordIdsSet = new Set<Id>();
        for(SObject sObj : sobjectRecords){
            recordIdsSet.add( (Id)sObj.get('Id') );
        }
        Map<Id, Boolean> recordAccessMap = checkEditAccess(recordIdsSet);
        List<Map<String, Object>> fieldValuesMapList = DatatableHelperClass.getFieldValues(sobjectRecords, responseWrapper.fieldsWrappersList, recordAccessMap);
        responseWrapper.dataList = fieldValuesMapList;
        return responseWrapper;
    }

    private static DatatableHelperClass.DataTableFieldsWrapper prepaseNameColumn(String fieldName, String fieldlabel, String fieldType){
        DatatableHelperClass.DataTableFieldsWrapper newWrapper = new DatatableHelperClass.DataTableFieldsWrapper();
        newWrapper.label     = fieldlabel;
        newWrapper.fieldName = fieldName;
        newWrapper.type      = fieldType;
        newWrapper.sortable  = true;
        newWrapper.editable  = true;
        newWrapper.wrapText  = true;
        return newWrapper;
    }

    private static void prepareFsColumns(String objectApiName, String fieldSetName, DatatableHelperClass.DataTableResponseWrapper responseWrapper, List<String> fieldsToQuery){
        
        List<Schema.FieldSetMember> fieldSetMembersList = DatatableHelperClass.getFieldSetMembers(objectApiName, fieldSetName);
        DatatableHelperClass.DataTableFieldsWrapper newFieldsWrapper;
        for (Schema.FieldSetMember field : fieldSetMembersList) {
            if(field.getSObjectField().getDescribe().isAccessible()){
                newFieldsWrapper = DatatableHelperClass.getFieldWrapper(field);
                fieldsToQuery.add( newFieldsWrapper.fieldName );
                responseWrapper.fieldsWrappersList.add(newFieldsWrapper);
            }
        }
    }

    private static Map<Id, Boolean> checkEditAccess(Set<Id> recordIdsSet){
        Map<Id, Boolean> recordAccessMap = new Map<Id, Boolean>();
        for(UserRecordAccess access : [SELECT RecordId, HasEditAccess FROM UserRecordAccess 
                                        WHERE UserId = :UserInfo.getUserId() AND RecordId IN :recordIdsSet]){
            recordAccessMap.put(access.RecordId, access.HasEditAccess);
        }
        return recordAccessMap;
    }

    private static String getFieldSetName(String objectName){
        Datatable_Handler__mdt mdt = Datatable_Handler__mdt.getInstance(objectName);
        return mdt ==null?'':mdt.FieldSet_Name__c;
    }
}
