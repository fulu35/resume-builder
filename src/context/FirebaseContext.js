import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';

// Create context
const FirebaseContext = createContext();

// Context hook
export const useFirebase = () => useContext(FirebaseContext);

// Provider component
export default function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User registration
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCredential.user, { displayName });

      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data);

      if (data.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (userId = null) => {
    try {
      const uid = userId || currentUser.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        throw new Error('Kullanıcı profili bulunamadı');
      }
    } catch (error) {
      throw error;
    }
  };

  // Save resume
  const saveResume = async (resumeData) => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const resumeRef = doc(collection(db, 'resumes'));
      const dataToSave = {
        ...resumeData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Kaydedilecek veri:', dataToSave);
      await setDoc(resumeRef, dataToSave);
      console.log('Veri başarıyla kaydedildi, ID:', resumeRef.id);

      return resumeRef.id;
    } catch (error) {
      console.error('Özgeçmiş kaydetme hatası:', error);
      throw error;
    }
  };

  // Update resume
  const updateResume = async (resumeId, resumeData) => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const resumeRef = doc(db, 'resumes', resumeId);
      const dataToUpdate = {
        ...resumeData,
        updatedAt: new Date().toISOString(),
        userId: currentUser.uid,
      };

      console.log('Güncellenecek veri:', dataToUpdate);
      await updateDoc(resumeRef, dataToUpdate);
      console.log('Veri başarıyla güncellendi');

      return true;
    } catch (error) {
      console.error('Özgeçmiş güncelleme hatası:', error);
      throw error;
    }
  };

  // Get user resumes
  const getUserResumes = async () => {
    try {
      if (!currentUser) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      console.log('Özgeçmişler getiriliyor, kullanıcı ID:', currentUser.uid);
      const resumesRef = collection(db, 'resumes');
      const q = query(resumesRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      const resumes = [];
      querySnapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log('Bulunan özgeçmiş sayısı:', resumes.length);
      return resumes;
    } catch (error) {
      console.error('Özgeçmiş getirme hatası:', error);
      throw error;
    }
  };

  // Upload file
  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    getUserProfile,
    saveResume,
    updateResume,
    getUserResumes,
    uploadFile,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}
