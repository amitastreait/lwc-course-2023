public with sharing class AccordionController {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        return [SELECT Id, Name, Email, Phone, MailingStreet, MailingCity, 
                        MailingState, MailingPostalCode, MailingCountry FROM 
                        Contact LIMIT 3];
    }
}
