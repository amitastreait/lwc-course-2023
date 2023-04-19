public with sharing class SearchProductService {
    
    @AuraEnabled
    public static List<sObject> searchProduct(String searchKeywrod, String priceBook2Id){
        String likeParam = '%'+searchKeywrod+'%'; // wid -> %wid%

        return [SELECT Id, Name, Pricebook2Id, Product2Id, Product2.Name, Product2.Family, Product2.ProductCode, Product2.Description,
                Product2.IsActive, UnitPrice, IsActive, ProductCode
                FROM
                    PricebookEntry
                WHERE 
                    IsActive = True AND
                    PriceBook2Id =: priceBook2Id AND
                    ( Product2.Name Like:likeParam OR Product2.ProductCode Like:likeParam )
                LIMIT 
                    100
            ];
    }
}