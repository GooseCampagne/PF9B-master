import { Component, OnInit } from '@angular/core';
import { FirebaseFirestoreService } from '../services/firebase-firestore.service';
import { FirebaseStorageService } from '../services/firebase-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  isEditing: boolean = false; // Estado de edición

  constructor(
    private firestoreService: FirebaseFirestoreService,
    private firebaseStorageService: FirebaseStorageService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private alertController: AlertController // Asegúrate de que esto esté importado
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
          this.profileImageUrl = url;
        },
        error => {
          console.error('Error uploading file', error);
        }
      );
    }
  }

  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
  
      const imageUrl = image.dataUrl;
      if (imageUrl) {
        // Convertir Data URL a un archivo
        const file = this.dataURLToFile(imageUrl, 'profile-image.jpg');
  
        // Subir la imagen al almacenamiento de Firebase
        this.firebaseStorageService.uploadFile(file).subscribe(
          url => {
            this.profileImageUrl = url;
          },
          error => {
            console.error('Error uploading image', error);
          }
        );
      }
    } catch (error) {
      console.error('Error capturing image', error);
    }
  }
// Función para convertir Data URL a un archivo
dataURLToFile(dataURL: string, filename: string): File {
  const [header, data] = dataURL.split(',');
  const mime = header.split(':')[1].split(';')[0];
  const byteString = atob(data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], filename, { type: mime });
}
  async updateProfile() {
    if (this.isEditing) {
      try {
        await this.firestoreService.saveUserProfile(this.firstName, this.lastName, this.phoneNumber);
        await this.showAlert('Success', 'Profile updated successfully');
        this.isEditing = false; // Desactiva el modo de edición después de guardar
      } catch (error) {
        console.error('Error updating profile', error);
        await this.showAlert('Error', 'Failed to update profile');
      }
    }
  }

  editProfile() {
    this.isEditing = true; // Activa el modo de edición
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error signing out', error);
      });
  }

  toggleTheme(event: any) {
    const isDarkMode = event.detail.checked;
    document.body.classList.toggle('dark', isDarkMode);
  }

  goBack() {
    this.location.back();
  }
}
