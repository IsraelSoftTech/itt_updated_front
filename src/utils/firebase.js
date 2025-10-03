// Firebase SDK initialization and helpers
import { initializeApp } from 'firebase/app'
import { getDatabase, ref as dbRef, get as dbGet, set as dbSet, onValue, off as dbOff } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCp5YQ5xZxRJAyvyvtGxKDuyMRQh4FlC8s',
  authDomain: 'canteen-50dc6.firebaseapp.com',
  databaseURL: 'https://canteen-50dc6-default-rtdb.firebaseio.com',
  projectId: 'canteen-50dc6',
  storageBucket: 'canteen-50dc6.firebasestorage.app',
  messagingSenderId: '110605403463',
  appId: '1:110605403463:web:236408cba98d6e72aeb862'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export { dbRef, dbGet, dbSet, onValue, dbOff }


