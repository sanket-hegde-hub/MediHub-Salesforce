trigger InvoiceTrigger on Invoice__c (before insert, after insert, before update, after update, before delete, after delete, after undelete) {

    if(Trigger.isAfter && Trigger.isUpdate){
        InvoiceTriggerHandler.updateAppointmentStatus(Trigger.new);
    }

}