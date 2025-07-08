import { LightningElement, track, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAppointmentGroupedByPatient from '@salesforce/apex/AppointmentController.getAppointmentGroupedByPatient';
import getPatientDetails from '@salesforce/apex/PatientController.getPatientDetails';

export default class AppointmentDetails extends LightningElement {
    @track appointmentMap = [];
    @track patientMap = [];
    @track selectedPatientDetail = {};
    @track isPatientModalOpen = false;
    @track isBookingModalOpen = false;
    @track selectedPatientId = '';
    @track selectedPatientName = '';

    // connectedCallback() {
    //     this.template.addEventListener('refreshappointments', this.handleExternalRefresh.bind(this));
    // }

    @wire(getPatientDetails)
    wiredPatients({ data, error }) {
        if (data) {
            this.patientMap = data;

        } else if (error) {
            console.error('Error fetching patient details:', error);
        }
    }
    @wire(getAppointmentGroupedByPatient)
    wiredAppointments(result) {
        this.wiredAppointmentResult = result;

        const { data, error } = result;

        if (data) {
            const appointmentMap = data;

            this.appointmentMap = this.patientMap.map(patient => {
                const appointments = appointmentMap[patient.Name] || [];

                const formattedAppointments = appointments.map(appt => ({
                    ...appt,
                    TimeSlotFormatted: this.formatMillisecondsToTime(appt.Time_Slot__c),
                    statusClass: this.getStatusClass(appt.Status__c)
                }));

                return {
                    patientName: patient.Name,
                    patientId: patient.Id,
                    appointments: formattedAppointments
                };
            });

        } else if (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    // handleExternalRefresh() {
    //     this.refreshAppointments()
    //         .then(() => {
    //             console.log('Appointments refreshed after booking');
    //         })
    //         .catch(error => {
    //             console.error('Refresh failed:', error);
    //         });
    // }

    @api refreshAppointmentsExternally() {
        this.refreshAppointments()
            .then(() => {
                console.log('Appointments refreshed externally');
            })
            .catch(error => {
                console.error('Error refreshing appointments:', error);
            });
    }

    openPatientDetail(event) {
        const patientId = event.target.dataset.patientId;
        const patient = this.patientMap.find(p => p.Id === patientId);
        if (patient) {
            this.selectedPatientDetail = patient;
            this.isPatientModalOpen = true;
        } else {
            console.warn('Patient not found');
        }
    }
    closePatientModal() {
        this.isPatientModalOpen = false;
        this.selectedPatientDetail = {};
    }

    openBookingModal(event) {
        this.selectedPatientId = event.target.dataset.patientId;
        this.selectedPatientName = event.target.dataset.patientName;
        this.isBookingModalOpen = true;
    }
    refreshAppointments() {
        return refreshApex(this.wiredAppointmentResult);
    }
    closeBookingModal() {
        this.isBookingModalOpen = false;
        this.refreshAppointments()
            .then(() => {
                console.log('Appointments refreshed successfully');
            })
            .catch(error => {
                console.error('Error refreshing appointments:', error);
            });
    }
    getStatusClass(status) {
        switch (status) {
            case 'Completed':
                return 'status-completed';
            case 'Cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    }
    formatMillisecondsToTime(ms) {
        const date = new Date(ms);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
}