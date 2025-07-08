@isTest
private class DoctorControllerTest {
    
    @TestSetup
    static void makeData(){
        List<Doctor__c> doctor =  MediHubTestDataFactory.createDoctor('Test Doctor', 'Cardiology', 5, false);
        for(Doctor__c dct : doctor){
            dct.Available_Days__c = 'Monday';
            dct.Available_Shift__c = 'Morning';
            dct.Time_Slots__c = '10:00 AM - 10:30 AM';
        }
        insert doctor;
    }
    
    @IsTest
    static void testGetAvailableDoctors() {
        List<Doctor__c> availableDoctors = DoctorController.getAvailableDoctors();
        
        System.assertEquals(5, availableDoctors.size(), 'Unexpected number of available doctors');
        for (Doctor__c doctor : availableDoctors) {
            System.assertEquals('Cardiology', doctor.Specialization__c, 'Unexpected specialization');
            System.assertEquals('Monday', doctor.Available_Days__c, 'Unexpected available days');
            System.assertEquals('Morning', doctor.Available_Shift__c, 'Unexpected available shift');
            System.assertEquals('10:00 AM - 10:30 AM', doctor.Time_Slots__c, 'Unexpected time slots');
        }
    }  
}