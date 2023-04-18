public with sharing class AnynomousClass {
    @AuraEnabled
    public static List<User> searchUser(String searchText){
        String searchTerm = '%'+ searchText +'%';
        return [SELECT Id, Name, Title, Email, UserName, FullPhotoUrl, SmallPhotoUrl 
            FROM 
                User 
            WHERE 
                Name Like: searchTerm
                OR Email Like: searchTerm 
                OR UserName Like: searchTerm];
    }
}