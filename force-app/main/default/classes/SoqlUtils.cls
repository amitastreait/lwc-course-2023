public with sharing class SoqlUtils {

    private static FINAL String SELECT_CLAUSE               = 'SELECT ';
    private static FINAL String FROM_CLAUSE                 = ' FROM ';
    private static FINAL String WHERE_CLAUSE                = ' WHERE ';
    private static FINAL String LIMIT_CLAUSE                = ' LIMIT ';
    private static FINAL String ORDER_BY_CLAUSE             = ' ORDER BY ';
    private static FINAL String SECURITY_ENFORCED_CLAUSE    = ' WITH SECURITY_ENFORCED ';
    
    @AuraEnabled
    public static QueryResult query(String objectApiName, List<String> fieldsToQuery, String filterStatement, Map<String, Object> variableBindings, Integer limitRecords){
        QueryResult result = new QueryResult();
        if(fieldsToQuery == null || fieldsToQuery.size() == 0){
            result.errorMessage = 'Please specify the fields to Query from '+objectApiName;
            result.isSuccess = false;
            result.records = null;
        }
        String queryString = SELECT_CLAUSE+ String.join(fieldsToQuery, ',')+FROM_CLAUSE+objectApiName;
        if(limitRecords >0){
            queryString += LIMIT_CLAUSE+limitRecords;
        }
        if(String.isNotBlank(filterStatement)){
            queryString += WHERE_CLAUSE+filterStatement;
        }

        try {
            result.isSuccess = true;
            if(variableBindings != null && variableBindings.size()> 0){
                result.records = Database.queryWithBinds(queryString, variableBindings, AccessLevel.User_Mode);
            }else{
                result.records = Database.query(queryString);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return result;
    }

    public inherited sharing class QueryResult {
        private QueryResult(){
            this.isSuccess = true;
        }
        @AuraEnabled
        public List<SObject> records;
        @AuraEnabled
        public Boolean isSuccess;
        @AuraEnabled
        public String errorMessage;
    }

    public inherited sharing class QueryInput {

    }
}