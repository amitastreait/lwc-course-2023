public with sharing class AccountService {
    
    @AuraEnabled(cacheable=true)
    public static List<SObject> listAccounts(){
        try {
            return [SELECT Id, Name, Industry, Phone, Type, ParentId FROM Account LIMIT 100];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}