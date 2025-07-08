import { LightningElement, wire, track } from 'lwc';
import getDoctorCount from '@salesforce/apex/AppointmentController.getDoctorCount';
import getTodaysAppointments from '@salesforce/apex/AppointmentController.getTodaysAppointments';
export default class HospitalSummaryPanel extends LightningElement {
    @track doctors = 0;
    @track appointments = 0;

    @wire(getDoctorCount)
    wiredDoctorCount({ data, error }) {
        if (data) {
            this.doctors = data;
        } else if (error) {
            console.error('Error fetching doctor count:', error);
        }
    }

    @wire(getTodaysAppointments)
    wiredTodaysAppointments({ data, error }) {
        if (data) {
            this.appointments = data.length;
        } else if (error) {
            console.error('Error fetching today\'s appointments:', error);
        }
    }
}