public with sharing  class DynamicDataTable {

    @AuraEnabled(cacheable=true)
    public static List<string> getObjectList() {
        Map<string,string> mapObjectList = new Map<string,string>();
        Map<String,Map<String,Object>> mapObjects = new Map<String,Map<String,Object>>();
        Map<String, Schema.SObjectType> mapDescribedObjects = Schema.getGlobalDescribe();
        Map<String, DescribeSObjectResult> mapDescribedResults = new Map<String, DescribeSObjectResult>();
        //Set<String> setStandardObjects = new Set<String>{'lead','account','contact','opportunity','campaign'};
        List<String> lstObjList = new List<String>();
        for(String objectName:mapDescribedObjects.keyset()){
            DescribeSObjectResult objectResult = mapDescribedObjects.get(objectName).getDescribe();
            if(objectResult.isAccessible() && objectResult.isCreateable() && objectResult.isDeletable() && objectResult.isQueryable() && !objectResult.isCustomSetting()){
                //mapDescribedResults.put(objectResult.getName(),objectResult);
                lstObjList.add(objectResult.getName());
            }
        }
        system.debug('lstObjList :: ' + lstObjList);
        return lstObjList;
        
    }
    
    
    @AuraEnabled  
    public static List< sObject > fetchAccounts( String searchKey) {  
       // sObject obj = Schema.getGlobalDescribe().get(searchKey).newSObject();
        String strKey = '%' + searchKey + '%';  
        string strObjName =  ' ' + searchKey;
       //  return [ SELECT Id, Name, Industry FROM Account WHERE Name LIKE: strKey LIMIT 10 ];  
        string strquery = 'SELECT Id, Name  FROM ' + strObjName + ' LIMIT 10';
        system.debug('query :: ' + strquery);
        List<sObject> lstacct =  Database.query(strquery); 
        return lstacct;
          
    }  

   
}