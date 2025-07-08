import { LightningElement, track, wire, api } from 'lwc';
import createPatient from '@salesforce/apex/PatientController.createPatient';
export default class NewPatientScreen extends LightningElement {
    @track patientId;
    @track genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];
    name;
    dob;
    gender;
    email;
    phone;
    address;
    emrName;
    emrNumber;

    handlePatientChange(event) {
        this.name = event.target.value;
    }
    handleEmailChange(event) {
        this.email = event.target.value;
    }
    handlePhoneChange(event) {
        this.phone = event.target.value;
    }
    handleDobChange(event) {
        this.dob = event.detail.value;
    }
    handleGenderChange(event) {
        this.gender = event.detail.value;
    }
    handleAddressChange(event) {
        this.address = event.target.value;
    }
    handleEmrNameChange(event) {
        this.emrName = event.target.value;
    }
    handleEmrPhoneChange(event) {
        this.emrNumber = event.target.value;
    }
    handleCreatePatient() {
        let hasError = false;

        const name = this.template.querySelector('.patient-name');
        const dob = this.template.querySelector('.patient-dob');
        const gender = this.template.querySelector('.gender');
        const phone = this.template.querySelector('.patient-phone');
        const email = this.template.querySelector('.patient-email');

        if (name) name.setCustomValidity('');
        if (dob) dob.setCustomValidity('');
        if (gender) gender.setCustomValidity('');
        if (phone) phone.setCustomValidity('');
        if (email) email.setCustomValidity('');

        if (!this.name) {
            name.setCustomValidity('Name is required');
            name.reportValidity();
            hasError = true;
        }

        if (!this.dob) {
            dob.setCustomValidity('Date of birth is required');
            dob.reportValidity();
            hasError = true;
        }

        if (!this.gender) {
            gender.setCustomValidity('Gender is required');
            gender.reportValidity();
            hasError = true;
        }

        if (!this.email) {
            email.setCustomValidity('Email is required');
            email.reportValidity();
            hasError = true;
        }

        if (!this.phone) {
            phone.setCustomValidity('Phone is required');
            phone.reportValidity();
            hasError = true;
        }

        if (hasError) return;

        console.log('Collected data:', {
            name: this.name,
            dob: this.dob,
            gender: this.gender,
            email: this.email,
            phone: this.phone
        });

        createPatient({
            name: this.name,
            dob: this.dob,
            gender: this.gender,
            email: this.email,
            mobile: this.phone,
            address: this.address,
            emrName: this.emrName,
            emrNumber: this.emrNumber
        })
            .then(result => {
                this.createPatientId = result;
                this.dispatchEvent(new CustomEvent('patientcreated'));
                this.dispatchEvent(new CustomEvent('closemodal'));
            })
            .catch(error => {
                console.error('Error creating patient:', JSON.stringify(error));

                const message = error?.body?.message || 'Unknown error';
                const nameField = this.template.querySelector('.patient-name');
                if (nameField) {
                    nameField.setCustomValidity('Server error: ' + message);
                    nameField.reportValidity();
                }
            });

    }
}