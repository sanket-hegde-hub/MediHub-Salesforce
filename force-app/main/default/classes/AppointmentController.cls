public class AppointmentController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Patient__c> getPatients(){
        List<Patient__c> patients = [select Id, Name from Patient__c];
        return patients;
    }
    
    @AuraEnabled(Cacheable=true)
    public static List<Doctor__C> getDoctors(){
        List<Doctor__c> doctors = [select Id, Name from Doctor__c];
        return doctors;
    }
    
    @AuraEnabled
    public static Id createAppointment(String patientId, String doctorId, Date appointmentDate, String timeSlot, String reasonForVisit, String status) {
        Appointment__c appointment = new Appointment__c();
        appointment.Patient__c = patientId;
        appointment.Doctor__c = doctorId;
        appointment.Appointment_Date__c = appointmentDate;
        Datetime dt = Datetime.valueOf('2000-01-01 ' + timeSlot);
        appointment.Time_Slot__c = dt.time();
        appointment.Reason__c = reasonForVisit;
        appointment.Status__c = status;
        
        insert appointment;
        return appointment.Id;
    }
    
    @AuraEnabled(Cacheable=true)
    public static Map<String, List<Appointment__c>> getAppointmentGroupedByPatient() {
        Map<String, List<Appointment__c>> result = new Map<String, List<Appointment__c>>();
        
        List<Patient__c> patients = [SELECT Id, Name FROM Patient__c ORDER BY Name];
        Map<Id, List<Appointment__c>> apptMap = new Map<Id, List<Appointment__c>>();
        
        for (Appointment__c appt : [
        SELECT Id, Patient__c, Patient__r.Name, Doctor__r.Name, Appointment_Date__c, Time_Slot__c, Reason__c, Status__c 
        FROM Appointment__c
        ORDER BY Appointment_Date__c
    ]) {
            if (!apptMap.containsKey(appt.Patient__c)) {
                apptMap.put(appt.Patient__c, new List<Appointment__c>());
            }
            apptMap.get(appt.Patient__c).add(appt);
        }
        
        for (Patient__c patient : patients) {
            result.put(patient.Name, apptMap.get(patient.Id) != null ? apptMap.get(patient.Id) : new List<Appointment__c>());
        }
        
        return result;
    }
    
    
    @AuraEnabled(Cacheable=true)
    public static List<Appointment__c> getTodaysAppointments(){
        List<Appointment__c> todaysAppointments = [SELECT Id, Patient__r.Name, Doctor__r.Name, Appointment_Date__c, Time_Slot__c, Reason__c, Status__c 
                                                 FROM Appointment__c 
                                                 WHERE Appointment_Date__c = :Date.today() AND Status__c = 'Scheduled'
                                                 ORDER BY Patient__r.Name];
        return todaysAppointments;
    }
    
    @AuraEnabled(Cacheable=true)
    public static Integer getDoctorCount(){
        return [SELECT COUNT() FROM Doctor__c];
    }
}