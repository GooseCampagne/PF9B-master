import { Component, OnInit } from '@angular/core';
import { FirebaseFirestoreService } from '../services/firebase-firestore.service';
import { FirebaseStorageService } from '../services/firebase-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profileImageUrl: string = '';

  constructor(
    private firestoreService: FirebaseFirestoreService,
    private firebaseStorageService: FirebaseStorageService
  ) {}

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe(profile => {
      if (profile) {
        this.firstName = profile.firstName || '';
        this.lastName = profile.lastName || '';
        this.phoneNumber = profile.phoneNumber || '';
      }
    });

    this.firebaseStorageService.getUserProfileImageUrl().subscribe(url => {
      this.profileImageUrl = url;
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.firebaseStorageService.uploadFile(input.files[0]).subscribe(
        url => {
          this.profileImageUrl = url; // Actualiza la URL de la imagen en el perfil
        },
        error => {
          console.error('Error uploading file', error);
        }
      );
    }
  }

  updateProfile() {
    this.firestoreService.saveUserProfile(this.firstName, this.lastName, this.phoneNumber)
      .then(() => {
        console.log('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile', error);
      });
  }
}
