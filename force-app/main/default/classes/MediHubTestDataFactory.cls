public class MediHubTestDataFactory {
    
    public static List<Doctor__c> createDoctor(String name, String specialization,Integer count, Boolean doInsert){
        List<Doctor__c> doctors = new List<Doctor__c>();
        for(Integer i = 1; i<=count; i++){
            Doctor__c doctor = new Doctor__c();
            doctor.Name = name + ' ' + i;
            doctor.Specialization__c = specialization;
            doctors.add(doctor);
        }
        if(doInsert)
            insert doctors;
        
        return doctors;
    }
    
    public static List<Patient__c> createPatient(String name, Date dob, String gender, Integer count, Boolean doInsert){
        List<Patient__c> patients = new List<Patient__c>();
        for(Integer i = 1; i<=count; i++){
            Patient__c patient = new Patient__c();
            patient.Name = name + ' ' + i;
            patient.DOB__c = dob;
            patient.Gender__C = gender;
            patients.add(patient);
        }
        
        if(doInsert)
            insert patients;
        
        return patients;
    }
    
    public static List<Appointment__c> createAppointment(Date appointmentDate, String timeSlot, Integer count, Boolean doInsert){
        List<Appointment__c> appointments = new List<Appointment__c>();
        for(Integer i = 1; i<=count; i++){
            Appointment__c appointment = new Appointment__c();
            appointment.Appointment_Date__c = appointmentDate;
            Datetime dt = Datetime.valueOf('2000-01-01 ' + timeSlot);
            appointment.Time_Slot__c = dt.time();
            appointments.add(appointment);
        }
        if(doInsert)
            insert appointments;
        
        return appointments;
    }
}