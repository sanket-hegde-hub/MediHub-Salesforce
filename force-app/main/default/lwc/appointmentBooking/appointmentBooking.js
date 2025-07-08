import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getDoctors from '@salesforce/apex/AppointmentController.getDoctors';
import getPatients from '@salesforce/apex/AppointmentController.getPatients';
import createAppointment from '@salesforce/apex/AppointmentController.createAppointment';

export default class AppointmentBooking extends LightningElement {
    @api patientId;
    @api patientName;
    @track doctorOptions = [];
    @track patientOptions = [];
    @track timeSlotOptions = [
        { label: '08:00 AM', value: '08:00 AM' },
        { label: '08:30 AM', value: '08:30 AM' },
        { label: '09:00 AM', value: '09:00 AM' },
        { label: '09:30 AM', value: '09:30 AM' },
        { label: '10:00 AM', value: '10:00 AM' },
        { label: '10:30 AM', value: '10:30 AM' },
        { label: '11:00 AM', value: '11:00 AM' },
        { label: '11:30 AM', value: '11:30 AM' },
        { label: '12:00 PM', value: '12:00 PM' },
        { label: '12:30 PM', value: '12:30 PM' },
        { label: '01:00 PM', value: '01:00 PM' },
        { label: '01:30 PM', value: '01:30 PM' },
        { label: '02:00 PM', value: '02:00 PM' },
        { label: '02:30 PM', value: '02:30 PM' },
        { label: '03:00 PM', value: '03:00 PM' },
        { label: '03:30 PM', value: '03:30 PM' },
        { label: '04:00 PM', value: '04:00 PM' },
        { label: '04:30 PM', value: '04:30 PM' },
        { label: '05:00 PM', value: '05:00 PM' },
        { label: '05:30 PM', value: '05:30 PM' },
        { label: '06:00 PM', value: '06:00 PM' },
        { label: '06:30 PM', value: '06:30 PM' },
        { label: '07:00 PM', value: '07:00 PM' }
    ];

    selectedDoctorId;
    selectedPatientId;
    appointmentDate;
    timeSlot;
    reason;
    status;

    connectedCallback() {
        if (this.patientId) {
            this.selectedPatientId = this.patientId;
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Test',
                message: 'If you see this, toast is working!',
                variant: 'success'
            })
        );

    }

    @wire(getDoctors)
    wiredDoctors({ data, error }) {
        if (data) {
            this.doctorOptions = data.map(doc => ({
                label: doc.Name,
                value: doc.Id
            }));
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    @wire(getPatients)
    wiredPatients({ data, error }) {
        if (data) {
            this.patientOptions = data.map(p => ({
                label: p.Name,
                value: p.Id
            }));
        } else if (error) {
            console.error('Error fetching patients:', error);
        }
    }

    handleDoctorChange(event) {
        this.selectedDoctorId = event.detail.value;
    }

    handlePatientChange(event) {
        this.selectedPatientId = event.detail.value;
    }

    handleDateChange(event) {
        this.appointmentDate = event.detail.value;
    }

    handleTimeSlotChange(event) {
        this.timeSlot = event.detail.value;
    }

    handleReasonChange(event) {
        this.reason = event.detail.value;
    }

    formatToTimeValue(timeStr) {
        const parts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (!parts) return null;

        let hour = parseInt(parts[1], 10);
        const minute = parseInt(parts[2], 10);
        const period = parts[3];

        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    }


    bookAppointment() {
        let hasError = false;

        const dateInput = this.template.querySelector('.appointment-date');
        const timeInput = this.template.querySelector('.appointment-time');
        const doctorInput = this.template.querySelector('.doctor-select');

        if (dateInput) dateInput.setCustomValidity('');
        if (timeInput) timeInput.setCustomValidity('');
        if (doctorInput) doctorInput.setCustomValidity('');

        if (!this.appointmentDate && dateInput) {
            dateInput.setCustomValidity('Appointment date is required');
            dateInput.reportValidity();
            hasError = true;
        }
        if (!this.timeSlot && timeInput) {
            timeInput.setCustomValidity('Time slot is required');
            timeInput.reportValidity();
            hasError = true;
        }
        if (!this.selectedDoctorId && doctorInput) {
            doctorInput.setCustomValidity('Doctor selection is required');
            doctorInput.reportValidity();
            hasError = true;
        }

        const today = new Date();
        const selectedDate = new Date(this.appointmentDate);
        if (selectedDate < today.setHours(0, 0, 0, 0)) {
            if (dateInput) {
                dateInput.setCustomValidity('Appointment date cannot be in the past');
                dateInput.reportValidity();
            }
            hasError = true;
        }

        if (hasError) {
            return;
        }
        const formattedTime = this.formatToTimeValue(this.timeSlot);

        createAppointment({
            patientId: this.selectedPatientId,
            doctorId: this.selectedDoctorId,
            appointmentDate: this.appointmentDate,
            timeSlot: formattedTime,
            reasonForVisit: this.reason,
            status: 'Pending'
        }).then(result => {
            this.createAppointmentId = result;
            
            this.dispatchEvent(new CustomEvent('closemodal'));
        }).catch(error => {
            console.error('Error creating appointment:', error?.body?.message || error);
            if (dateInput) {
                dateInput.setCustomValidity('Server error: ' + (error?.body?.message || 'Unknown error'));
                dateInput.reportValidity();
            }
        });
    }
}