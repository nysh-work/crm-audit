/**
 * Local Storage Utilities
 * 
 * This file contains functions for storing and retrieving data from the browser's localStorage.
 * It provides a way to persist form data between sessions.
 */

const STORAGE_KEY = 'audit_fee_calculator_data';

/**
 * Save the entire form state to localStorage
 * 
 * @param {Object} data - The data to save
 */
export const saveToLocalStorage = (data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load the form state from localStorage
 * 
 * @returns {Object|null} - The loaded data or null if no data exists
 */
export const loadFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Clear the stored form data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Automatically save form data on changes
 * 
 * @param {Object} formData - The form data to save
 */
export const autoSave = (formData) => {
  const timeoutId = setTimeout(() => {
    saveToLocalStorage(formData);
  }, 500); // Debounce for better performance
  
  return () => clearTimeout(timeoutId);
};

/**
 * Check if there is any saved data in localStorage
 * 
 * @returns {boolean} - True if data exists, false otherwise
 */
export const hasSavedData = () => {
  return localStorage.getItem(STORAGE_KEY) !== null;
}; 