public with sharing class MetadataRetreiver {
    /*
        SELECT Id, FieldAPIName__c, FieldAPIName__r.QualifiedApiName, ParentObjectDetails__c, ObjectAPIName__c,
            ObjectAPIName__r.QualifiedApiName, Order__c 
        FROM 
            ChildFieldDetails__mdt 
        WHERE 
            ParentObjectDetails__r.ObjectAPIName__r.QualifiedApiName = 'Contact' AND 
            ParentObjectDetails__r.PlaceUsed__c = 'Home Page' 
        Order BY 
            Order__c ASC
    */
    @AuraEnabled(cacheable=true)
    public static List<sObject> getMetadataObjectRecords(String objectApiName, String placeToBeUsed, String usedFor){
        return [
            SELECT
                Id,
                FieldAPIName__c,
                FieldAPIName__r.QualifiedApiName,
                ObjectAPIName__c,
                ObjectAPIName__r.QualifiedApiName,
                ParentObjectDetails__c,
                Order__c,
                UseFor__c
            FROM
                ChildFieldDetails__mdt
            WHERE
                ParentObjectDetails__r.ObjectAPIName__r.QualifiedApiName =: objectApiName AND
                ParentObjectDetails__r.PlaceUsed__c =: placeToBeUsed AND
                ( UseFor__c =: usedFor OR UseFor__c = 'Both Edit/New Record' )
            ORDER BY
                Order__c ASC
            LIMIT
                100
        ];
    }
}