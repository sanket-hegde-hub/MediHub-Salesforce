public class UserInfoController {

    @AuraEnabled(Cacheable=true)
    public static String getUserProfile(){
       User user = [Select Profile.Name from User where Id =: UserInfo.getUserId() limit 1];
        return user.Profile.Name;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserName() {
        User usr = [SELECT Name FROM User WHERE Id = :UserInfo.getUserId()];
        return usr.Name;
    }
}