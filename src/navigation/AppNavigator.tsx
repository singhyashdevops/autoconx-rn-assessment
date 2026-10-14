import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/booking';
import MyVehicleScreen from '../screens/MyVehicleScreen';
import BookInspectionScreen from '../screens/BookInspectionScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <>
      <StatusBar
        backgroundColor="#1D224A"
        barStyle="light-content"
        translucent={false}
      />

      <Stack.Navigator
        initialRouteName="MyVehicle"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1D224A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#F4F6FA',
          },
        }}
      >
        <Stack.Screen
          name="MyVehicle"
          component={MyVehicleScreen}
          options={{ title: 'My Vehicle' }}
        />

        <Stack.Screen
          name="BookInspection"
          component={BookInspectionScreen}
          options={{ title: 'Book Inspection' }}
        />

        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{
            title: 'Confirmation',
            headerBackVisible: false,
          }}
        />

        <Stack.Screen
          name="BookingDetails"
          component={BookingDetailsScreen}
          options={{ title: 'Booking Details' }}
        />
      </Stack.Navigator>
    </>
  );
}