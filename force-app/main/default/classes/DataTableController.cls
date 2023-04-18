public with sharing class DataTableController {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        List<Contact> contactList = new List<Contact>();
        try {
            contactList = [SELECT Id, Name, Phone, Title, Email, AccountId, Account.Name,
                            Account.Phone
                            FROM Contact
                            LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return contactList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(){
        List<Account> accountList = new List<Account>();
        try {
            accountList = [SELECT Id, Name, Description, ShippingStreet, ShippingCity, 
                            ShippingPostalCode, ShippingCountry,
                            ShippingState FROM Account 
                            WHERE ShippingStreet != null
                            LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return accountList;
    }
}
