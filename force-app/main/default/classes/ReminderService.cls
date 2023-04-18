public with sharing class ReminderService {


    @AuraEnabled(cacheable=true) // Task, Status
    public static List<ReminderService.PickList> fetchPicklistValues(String objectApiName, String fieldApiName){

        List<ReminderService.PickList> pisklistValuesList = new List<ReminderService.PickList>();

        // Map<String, Schema.SObjectType> sobjectTypeMap = Schema.getGlobalDescribe();
        // sobjectTypeMap.get(objectApiName) // Task, Event, Contact

        Schema.SObjectType sObjectTypeObject = Schema.getGlobalDescribe().get(objectApiName);
        Schema.DescribeSObjectResult describeSObject = sObjectTypeObject.getDescribe();

        Map<String, Schema.SObjectField> fieldsMap = describeSObject.fields.getMap();
        // Schema.SObjectField fieldResult = fieldsMap.get(fieldApiName);
        // Schema.DescribeFieldResult result = fieldResult.getDescribe(); 

        List<Schema.PicklistEntry> picklistEntryList = fieldsMap.get(fieldApiName).getDescribe().getPickListValues();

        for (Schema.PicklistEntry picklist : picklistEntryList) {
            pisklistValuesList.add( new ReminderService.PickList( picklist.getLabel() , picklist.getValue() ) );
        }

        System.debug(System.LoggingLevel.DEBUG, JSON.serialize(pisklistValuesList) );
        return pisklistValuesList;

    }

    @AuraEnabled
    public static void createToDoItem(String taskString){
        try {
            Task taskRecord = (Task)JSON.deserialize(taskString, Task.class);
            upsert taskRecord; // Id (Upsert) // insert
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled//(cacheable=true)
    public static List<SObject> fetchToDoList(){
        try {
            return [SELECT Id, Subject, Description, ActivityDate, Status, Priority
                    FROM 
                        Task 
                    WHERE
                        OwnerId =: UserInfo.getUserId() AND // Current Loggedin User id
                        ActivityDate != null
                ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Wrapper Class OR Inner Class
    public class PickList {

        @AuraEnabled
        public String label;

        @AuraEnabled
        public String value;

        public PickList(String label, String value){
            this.label = label;
            this.value = value;
        }

    }
}