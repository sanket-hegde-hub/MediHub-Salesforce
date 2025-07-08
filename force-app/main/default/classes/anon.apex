List<Medical_Record__c> appt = [select Id from Medical_Record__c];
delete appt;

List<Appointment__c> appointments = [SELECT Id FROM Appointment__c];
delete appointments;

List<Invoice__c> invoices = [SELECT Id FROM Invoice__c];
delete invoices;