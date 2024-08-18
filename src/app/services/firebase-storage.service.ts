import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  constructor(
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth
  ) {}

  uploadFile(file: File): Observable<string> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) throw new Error('No user logged in');
        const filePath = `users/${user.uid}/profile/profile-image.jpg`; 
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
  
        return task.snapshotChanges().pipe(
          switchMap(() => fileRef.getDownloadURL())
        );
      })
    );
  }
  
  getUserProfileImageUrl(): Observable<string> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) throw new Error('No user logged in');
        const filePath = `users/${user.uid}/profile/profile-image.jpg`;
        return this.storage.ref(filePath).getDownloadURL();
      })
    );
  }
}
