public with sharing class AddProductsService {
    
    //sObject newSObjectRecord = Schema.getGlobalDescribe().get(objectApiName).newSObject() ;

    @AuraEnabled(cacheable=true)
    public static List<sObject> getPriceBookEntries(String priceBook2Id){
        try {
            return [SELECT Id, IsActive, UnitPrice, Product2Id, Pricebook2Id, Name
                FROM PricebookEntry
                WHERE IsActive = True AND PriceBook2Id =:priceBook2Id
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void submitProducts(String objectApiName, String records){
        try {
            if(objectApiName == 'Opportunity'){
                List<OpportunityLineItem> lineItems = (List<OpportunityLineItem>)JSON.deserialize(records, List<OpportunityLineItem>.class);
                upsert lineItems;
            }else if(objectApiName == 'Order'){
                List<OrderItem> lineItems = (List<OrderItem>)JSON.deserialize(records, List<OrderItem>.class);
                upsert lineItems;
            }else if(objectApiName == 'Quote'){
                List<QuoteLineItem> lineItems = (List<QuoteLineItem>)JSON.deserialize(records, List<QuoteLineItem>.class);
                upsert lineItems;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updatePriceBook2(String priceBook2Id, String objectApiName, String recordId){
        try {
            sObject newSObjectRecord = Schema.getGlobalDescribe().get(objectApiName).newSObject();
            newSObjectRecord.put('Pricebook2Id', priceBook2Id);
            newSObjectRecord.put('Id', recordId);
            update newSObjectRecord;
            /*
                if(objectApiName == 'Opportunity'){
                    Opportunity obj = new Opportunity(Id = recordId, Pricebook2Id = priceBook2Id);
                    update obj;
                }else if(objectApiName == 'Order'){

                }
            */
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> fetchPriceBookId(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> queryLineItemRecords(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<sObject> listLineItems(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}