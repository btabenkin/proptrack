import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import DashboardScreen      from './src/screens/DashboardScreen';
import PropertiesScreen     from './src/screens/PropertiesScreen';
import PropertyFormScreen   from './src/screens/PropertyFormScreen';
import TenantsScreen        from './src/screens/TenantsScreen';
import TenantFormScreen     from './src/screens/TenantFormScreen';
import PaymentsScreen       from './src/screens/PaymentsScreen';
import PaymentFormScreen    from './src/screens/PaymentFormScreen';
import ExpensesScreen       from './src/screens/ExpensesScreen';
import ExpenseFormScreen    from './src/screens/ExpenseFormScreen';
import MaintenanceScreen    from './src/screens/MaintenanceScreen';
import MaintenanceFormScreen from './src/screens/MaintenanceFormScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const NAV_OPTS = {
  headerStyle:      { backgroundColor: '#0f172a' },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: '600' },
};

function PropertiesStack() {
  return (
    <Stack.Navigator screenOptions={NAV_OPTS}>
      <Stack.Screen name="PropertiesList" component={PropertiesScreen} options={{ title: 'Properties' }} />
      <Stack.Screen name="PropertyForm"   component={PropertyFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Edit Property' : 'Add Property' })} />
    </Stack.Navigator>
  );
}

function TenantsStack() {
  return (
    <Stack.Navigator screenOptions={NAV_OPTS}>
      <Stack.Screen name="TenantsList" component={TenantsScreen} options={{ title: 'Tenants' }} />
      <Stack.Screen name="TenantForm"  component={TenantFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Edit Tenant' : 'Add Tenant' })} />
    </Stack.Navigator>
  );
}

function PaymentsStack() {
  return (
    <Stack.Navigator screenOptions={NAV_OPTS}>
      <Stack.Screen name="PaymentsList" component={PaymentsScreen} options={{ title: 'Rent Payments' }} />
      <Stack.Screen name="PaymentForm"  component={PaymentFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Edit Payment' : 'Record Payment' })} />
    </Stack.Navigator>
  );
}

function ExpensesStack() {
  return (
    <Stack.Navigator screenOptions={NAV_OPTS}>
      <Stack.Screen name="ExpensesList" component={ExpensesScreen} options={{ title: 'Expenses' }} />
      <Stack.Screen name="ExpenseForm"  component={ExpenseFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Edit Expense' : 'Add Expense' })} />
    </Stack.Navigator>
  );
}

function MaintenanceStack() {
  return (
    <Stack.Navigator screenOptions={NAV_OPTS}>
      <Stack.Screen name="MaintenanceList" component={MaintenanceScreen} options={{ title: 'Maintenance' }} />
      <Stack.Screen name="MaintenanceForm" component={MaintenanceFormScreen} options={({ route }) => ({ title: route.params?.item ? 'Edit Request' : 'New Request' })} />
    </Stack.Navigator>
  );
}

const icon = (label) => ({ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>{label}</Text>, tabBarActiveTintColor: '#3b82f6', tabBarInactiveTintColor: '#94a3b8' });

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' }, tabBarActiveTintColor: '#3b82f6', tabBarInactiveTintColor: '#64748b' }}>
        <Tab.Screen name="Dashboard"   component={DashboardScreen}  options={{ title: 'Dashboard',   tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⬛</Text> }} />
        <Tab.Screen name="Properties"  component={PropertiesStack}  options={{ title: 'Properties',  tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏢</Text> }} />
        <Tab.Screen name="Tenants"     component={TenantsStack}     options={{ title: 'Tenants',     tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text> }} />
        <Tab.Screen name="Payments"    component={PaymentsStack}    options={{ title: 'Payments',    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💰</Text> }} />
        <Tab.Screen name="More"        component={ExpensesStack}    options={{ title: 'Expenses',    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text> }} />
        <Tab.Screen name="Maintenance" component={MaintenanceStack} options={{ title: 'Maintenance', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔧</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
