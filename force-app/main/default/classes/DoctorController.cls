public class DoctorController {

    @AuraEnabled(Cacheable=true)
    public static List<Doctor__c> getAvailableDoctors() {
        return [select Id, Name, Specialization__c, Available_Days__c, Available_Shift__c, Time_Slots__c from Doctor__c ];
    }
}