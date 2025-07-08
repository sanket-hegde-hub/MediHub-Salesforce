trigger AppointmentTrigger on Appointment__c (before insert, after insert, before update, after update, before delete, after delete, after undelete) {

    if(Trigger.isAfter && Trigger.isInsert){
        AppointmentTriggerHandler.createMedicalRecordAndInvoice(Trigger.new);
    }
    if(Trigger.isAfter && Trigger.isUpdate){
        AppointmentTriggerHandler.deleteInvoice(Trigger.new, Trigger.oldMap);
    }
    if(Trigger.isBefore && Trigger.isInsert){
        AppointmentTriggerHandler.checkDuplicates(Trigger.new);
        AppointmentTriggerHandler.validateAppointmentDate(Trigger.new);
    }
}