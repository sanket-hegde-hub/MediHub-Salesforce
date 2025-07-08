import { LightningElement, track, wire } from 'lwc';
import getAvailableDoctors from '@salesforce/apex/DoctorController.getAvailableDoctors';
export default class DoctorAvailability extends LightningElement {
    @track shiftGroups = [];

  get hasDoctors() {
    return this.shiftGroups.length > 0;
  }

  getTodayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  @wire(getAvailableDoctors)
  wiredDoctors({ data, error }) {
    if (data) {
      this.groupDoctorsByShift(data);
    } else if (error) {
      console.error('Error fetching doctors:', error);
    }
  }

  groupDoctorsByShift(doctors) {
    const shifts = {
      Morning: [],
      Afternoon: [],
      Evening: []
    };

    const today = this.getTodayName();

    doctors.forEach(doc => {
      if (doc.Available_Days__c && doc.Available_Days__c.includes(today)) {
        shifts[doc.Available_Shift__c]?.push(doc);
      }
    });

    this.shiftGroups = Object.entries(shifts)
      .filter(([_, list]) => list.length)
      .map(([shift, doctors]) => ({
        shift,
        doctors
      }));
  }
}