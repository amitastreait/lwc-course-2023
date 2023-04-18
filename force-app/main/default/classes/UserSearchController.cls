public with sharing class UserSearchController {
    @AuraEnabled
    public static List<User> searchUser(String searchTerm){
        // SELECT Id, Name, Title, Email, UserName FROM User WHERE Name like '%am%' OR Email like '%am%' OR UserName like '%am%' OR Title like '%am%'
        String likeParam = '%'+searchTerm+'%'; // %am%
        return [SELECT Id, Name, Title, Email, UserName, FullPhotoUrl, SmallPhotoUrl
            FROM User 
            WHERE 
                Name Like: likeParam 
                OR Email Like: likeParam
                OR UserName Like: likeParam
                OR Title Like: likeParam
            ];
    }
}