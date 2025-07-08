import { LightningElement, track, wire } from 'lwc';
import getUserProfile from '@salesforce/apex/UserInfoController.getUserProfile';
import getUserName from '@salesforce/apex/UserInfoController.getUserName';
export default class MedHubHomePage extends LightningElement {
  @track view = 'home';
  @track userName = '';
  @track userRole = '';

  get isHome() {
    return this.view === 'home';
  }
  get isBooking() {
    return this.view === 'booking';
  }
  get isDetails(){
    return this.view === 'details';
  }
  get isDoctorsToday() {
    return this.view === 'doctors';
  }
  get isPatientDetails() {
    return this.view === 'patientDetails';
  }

  @wire(getUserName)
  wiredName({ data, error }) {
    if (data) this.userName = data;
  }

  @wire(getUserProfile)
  wiredProfile({ data, error }) {
    if (data) this.userRole = data;
  }

  goHome() {
    this.view = 'home';
  }

  goDetails() {
    this.view = 'details';
    setTimeout(() => {
        const detailsComponent = this.template.querySelector('c-appointment-details');
        if (detailsComponent && typeof detailsComponent.refreshAppointmentsExternally === 'function') {
            detailsComponent.refreshAppointmentsExternally();
        }
    }, 0);
  }

  goBooking() {
    this.view = 'booking';
  }

  goDoctorsToday() {
    this.view = 'doctors';
  }

  goPatientDetails(){
    this.view = 'patientDetails';
  }

  goToProfile() {
    window.open('/lightning/setup/ManageUsers/page?address=/005' + '/view', '_blank');
  }

  logout() {
    window.location.href = '/secur/logout.jsp';
  }
}