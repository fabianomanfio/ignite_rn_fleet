import * as TaskManager from 'expo-task-manager';
import { startLocationUpdatesAsync, Accuracy, hasStartedLocationUpdatesAsync, stopLocationUpdatesAsync } from 'expo-location';
import { removeStorageLocation, saveStorageLocation } from '../libs/asyncStorage/locationStorage';

export const BACKGROUND_TASK_NAME = 'location_tracking';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    if (data) {
      const { coords, timestamp } = data.locations[0];

      const currentLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: timestamp,
      };      

      await saveStorageLocation(currentLocation);
    }
  } catch (error) {
    console.log(error);
    stopLocationTask();
  }
});

export async function startLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    if(hasStarted) {
      await stopLocationTask();
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 1000
    })    
    
  } catch (error) {
    console.log('ERROR 1:', error);
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);

    if(hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
      await removeStorageLocation();
    }
  } catch (error) {
    console.log(error);
    
  }
}