public class PatientController {
    @AuraEnabled(Cacheable=true)
    public static List<Patient__c> getPatientDetails() {
        List<Patient__c> patients = [SELECT Id, Name,Address__c,DOB__c,Email__c,Emergency_contact_name__c,Emergency_contact_number__c,Gender__c,Mobile__c FROM Patient__c ORDER BY Name];
        return patients;
    }

    @AuraEnabled
public static Id createPatient(String name, String address, Date dob, String gender, String email, String mobile, String emrName, String emrNumber) {
    try {
        Patient__c patient = new Patient__c();
        patient.Name = name;
        patient.Address__c = address;
        patient.DOB__c = dob;
        patient.Gender__c = gender;
        patient.Email__c = email;
        patient.Mobile__c = mobile;
        patient.Emergency_contact_name__c = emrName;
        patient.Emergency_contact_number__c = emrNumber;

        insert patient;
        return patient.Id;

    } catch (Exception e) {
        // Expose the actual message to LWC
        throw new AuraHandledException('Error creating patient: ' + e.getMessage());
    }
}

}