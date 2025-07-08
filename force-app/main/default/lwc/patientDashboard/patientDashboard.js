import { LightningElement, track, wire } from 'lwc';
import getPatientDetails from '@salesforce/apex/PatientController.getPatientDetails';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class PatientDashboard extends LightningElement {
    @track patientMap = [];
    @track isBookingModalOpen = false;
    @track isPatientModalOpen = false;
    @track selectedPatientId = '';
    @track selectedPatientName = '';
    searchVanlue = '';
    allPatients = [];

    @wire(getPatientDetails)
    wiredPatients(result) {
        this.wiredPatientResult = result;
        const { data, error } = result;
        if (data) {
            this.patientMap = data;
            this.allPatients = data;

            return this.patientMap.map(patient => ({
                patientName: patient.Name,
                patientId: patient.Id,
                phone: patient.Phone__c,
                email: patient.Email__c,
                address: patient.Address__c,
                emrName: patient.Emergency_contact_name__c,
                emrNumber: patient.Emergency_contact_number__c,
                dob: patient.DOB__c,
                gender: patient.Gender__c
            }))
        } else if (error) {
            console.error('Error fetching patient details:', error);
        }
    }

    handlePatientCreated() {
        this.refreshPatients()
            .then(() => {
                console.log('Patients refreshed after creating');
            })
            .catch(error => {
                console.error('Refresh failed:', error);
            });
    }

    heandleToast(){
        this.showToast('Success', 'This is a test toast message', 'success');
    }

    handleSearchInput(event) {
        this.searchValue = event.target.value;
        this.handleSearch();
        if (!this.searchValue) {

            this.patientMap = [...this.allPatients];
            return;
        }
        this.patientMap = this.allPatients.filter(patient =>
            patient.Name?.toLowerCase().startsWith(this.searchValue)
        );
    }
    handleSearch() {
        const searchTerm = this.searchValue?.trim().toLowerCase();

        if (!searchTerm) {
            this.patientMap = [...this.allPatients];
            return;
        }

        this.patientMap = this.allPatients.filter(patient =>
            patient.Name.toLowerCase().includes(searchTerm)
        );

    }
    refreshPatients() {
        return refreshApex(this.wiredPatientResult);
    }
    get patientSummaryList() {
        return [
            { label: 'Appointments', value: this.appointments },
            { label: 'Medical Records', value: this.medicalRecords },
            { label: 'Invoices', value: this.invoices }
        ];
    }

    openPatientModal(event) {
        this.isPatientModalOpen = true;
    }

    closePatientModal() {
        this.isPatientModalOpen = false;
    }

    openBookingModal(event) {
        this.selectedPatientId = event.target.dataset.patientId;
        this.selectedPatientName = event.target.dataset.patientName;
        this.isBookingModalOpen = true;
    }


    closeBookingModal() {
        this.isBookingModalOpen = false;
        //     this.refreshAppointments()
        //         .then(() => {
        //             console.log('Appointments refreshed successfully');
        //         })
        //         .catch(error => {
        //             console.error('Error refreshing appointments:', error);
        //         });
    }

    // notifyAppointmentBooked() {
    //     const event = new CustomEvent('refreshappointments', { bubbles: true, composed: true });
    //     this.dispatchEvent(event);
    // }
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}