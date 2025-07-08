public class AppointmentTriggerHandler {

    public static void createMedicalRecordAndInvoice(List<Appointment__c> appointmentList) {
        List<Medical_Record__c> mList = new List<Medical_Record__c>();
        List<Invoice__c> iList = new List<Invoice__c>();
        for(Appointment__c appt:appointmentList){
            Medical_Record__c mr = new Medical_Record__c();
            Invoice__c inv = new Invoice__c();
            mr.Appointment__c = appt.Id;
            mr.Patient__c = appt.Patient__c;
            mr.Doctor__c = appt.Doctor__c;
            mr.Visit_Date__c = appt.Appointment_Date__c;

            
            inv.Appointment__c = appt.Id;
            inv.Invoice_Date__c = appt.Appointment_Date__c;
            inv.Payment_Status__c = 'Pending';

            mList.add(mr);
            iList.add(inv);
        }
        insert mList;
        insert iList;     
    }

    public static void deleteInvoice(List<Appointment__c> appList, Map<Id, Appointment__c> aptOldMap) {
        Set<ID> appId = new Set<ID>();
        for(Appointment__c apt:appList){
            if(apt.Status__c == 'Cancelled' && aptOldMap.get(apt.Id).Status__c != 'Cancelled'){
                appId.add(apt.Id);
            }
        }
        if(!appId.isEmpty()){
            List<Invoice__c> invList = [select Id from Invoice__c where Appointment__c in :appId];
            if(!invList.isEmpty()){
                delete invList;
            }
        }
    }

    public static void checkDuplicates(List<Appointment__c> aptList){
        Set<Id> doctorId = new Set<Id>();
        Set<Id> patientId = new Set<Id>();
        Set<Date> apptDate = new Set<Date>();
        Set<Time> apptTime = new Set<Time>();

        for(Appointment__c apt : aptList){
            if(apt.Doctor__c != null && apt.Patient__c != null && apt.Appointment_Date__c != null && apt.Time_Slot__c != null){
                doctorId.add(apt.Doctor__c);
                patientId.add(apt.Patient__c);
                apptDate.add(apt.Appointment_Date__c);
                apptTime.add(apt.Time_Slot__c);
            }
        }

        List<Appointment__c> oldAptList = [select Id, Doctor__c, Patient__c, Appointment_Date__c, Time_Slot__c
                                        from Appointment__c 
                                        where Doctor__c IN :doctorId AND Patient__c IN :patientId AND Appointment_Date__c IN :apptDate AND Time_Slot__c IN :apptTime];

        for (Appointment__c newApt : aptList) {
            for(Appointment__c oldApt : oldAptList){
                if(newApt.Doctor__c == oldApt.Doctor__c && newApt.Patient__c == oldApt.Patient__c && newApt.Appointment_Date__c == oldApt.Appointment_Date__c && newApt.Time_Slot__c == oldApt.Time_Slot__c)
                {
                    newApt.addError('Appointment already exists for the same Doctor and Patient on the same Date!');
                }     
            }   
        }   
    }
    
    public static void validateAppointmentDate(List<Appointment__c> aptList) {
        for(Appointment__c apt : aptList) {
            if(apt.Appointment_Date__c < Date.today()) {
                apt.addError('Appointment date cannot be in the past.');
            }
        }
    }
}
