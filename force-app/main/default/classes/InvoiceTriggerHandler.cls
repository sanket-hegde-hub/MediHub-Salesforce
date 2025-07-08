public class InvoiceTriggerHandler {

    public static void updateAppointmentStatus(List<Invoice__c> invList) {
        Set<ID> aptId = new Set<ID>();
        for(Invoice__c inv : invList){
            if(inv.Payment_Status__c == 'Paid' && inv.Appointment__c != null)
                aptId.add(inv.Appointment__c);   
        }

        List<Appointment__c> aptListToUpdate = [SELECT Id, Status__c FROM Appointment__c WHERE Id IN :aptId];
        for(Appointment__c apt : aptListToUpdate) {
            apt.Status__c = 'Completed';
        }
        if(!aptListToUpdate.isEmpty()) {
            update aptListToUpdate;
        }
    }
}