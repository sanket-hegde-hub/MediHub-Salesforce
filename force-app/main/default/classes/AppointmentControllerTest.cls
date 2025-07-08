@isTest
private class AppointmentControllerTest {
    
    @TestSetup
    public static void makeData(){
         // Create test data
        Patient__c patient1 = MediHubTestDataFactory.createPatient('Patient', Date.newInstance(1990, 1, 1), 'Male', 1, true )[0];
        
        Doctor__c doctor1 = MediHubTestDataFactory.createDoctor('Dr. Smith', 'Cardiology', 1, true)[0];
        
        Appointment__c appointment1 = new Appointment__c(
            Patient__c = patient1.Id,
        Doctor__c = doctor1.Id,
        Appointment_Date__c = Date.today(),
        Time_Slot__c = Time.newInstance(10, 0, 0, 0),
        Reason__c = 'Checkup',
        Status__c = 'Scheduled'
            );
        insert appointment1; 
        
        Appointment__c appointment2 = new Appointment__c(
            Patient__c = patient1.Id,
        Doctor__c = doctor1.Id,
        Appointment_Date__c = Date.today().addDays(1),
        Time_Slot__c = Time.newInstance(11, 0, 0, 0),
        Reason__c = 'Follow-up',
        Status__c = 'Scheduled'
            );
        insert appointment2;
    }
    @IsTest
    static void testGetAppointmentGroupedByPatient() {

        Patient__c patient1 = [SELECT Id, Name FROM Patient__c LIMIT 1];
        List<Appointment__c> appointment = [SELECT Id, Patient__r.Name FROM Appointment__c WHERE Patient__c = :patient1.Id];
        // Call the method to be tested
        Map<String, List<Appointment__c>> result = AppointmentController.getAppointmentGroupedByPatient();
        System.debug('Created patient name: ' + patient1.Name);
        System.debug('Result map keys: ' + result.keySet());
        
        // Assertions
        System.assertEquals(1, result.size(), 'There should be one patient in the result');
        System.assert(result.containsKey(patient1.Name), 'Patient 1 should be in the result');
        List<Appointment__c> appointments = result.get('Patient 1');
        System.assertEquals(2, appointments.size(), 'There should be two appointments for Patient 1');
        System.assertEquals(appointment[0].Id, appointments[0].Id, 'First appointment ID should match'); 
        System.assertEquals(appointment[1].Id, appointments[1].Id, 'Second appointment ID should match');
    }
    
}