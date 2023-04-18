public with sharing class AccountTreeGridController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(){
        List<Account> accountList = new List<Account>();
        try {
            accountList = [SELECT Id, Name, Rating, Type, Phone,
                            (SELECT Id, Name, Phone, Email FROM Contacts)
                            FROM ACCOUNT 
                            LIMIT 100];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return accountList;
    }
}
