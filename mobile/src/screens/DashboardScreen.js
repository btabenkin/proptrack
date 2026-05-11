import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import StatCard from '../components/StatCard';
import { propertiesApi, tenantsApi, rentPaymentsApi, expensesApi, maintenanceApi } from '../services/api';

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [props, tenants, payments, expenses, maintenance] = await Promise.all([
        propertiesApi.getAll(), tenantsApi.getAll(), rentPaymentsApi.getAll(),
        expensesApi.getAll(), maintenanceApi.getAll(),
      ]);
      setStats({
        properties: props.data.length,
        tenants: tenants.data.filter(t => t.status === 'active').length,
        totalRent: payments.data.reduce((s, p) => s + p.amount, 0),
        totalExpenses: expenses.data.reduce((s, e) => s + e.amount, 0),
        openMaintenance: maintenance.data.filter(m => m.status === 'open').length,
      });
    } catch { setStats({}); }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (!stats) return <View style={s.center}><Text style={s.loading}>Loading…</Text></View>;

  return (
    <ScrollView style={s.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={s.heading}>Dashboard</Text>
      <View style={s.row}>
        <StatCard label="Properties" value={stats.properties ?? 0} color="blue" />
        <StatCard label="Active Tenants" value={stats.tenants ?? 0} color="green" />
      </View>
      <View style={s.row}>
        <StatCard label="Rent Collected" value={`$${(stats.totalRent || 0).toLocaleString()}`} color="green" />
        <StatCard label="Total Expenses" value={`$${(stats.totalExpenses || 0).toLocaleString()}`} color="red" />
      </View>
      <View style={s.row}>
        <StatCard label="Open Maintenance" value={stats.openMaintenance ?? 0} color="orange" />
        <View style={{ flex: 1, margin: 6 }} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  heading:   { fontSize: 24, fontWeight: '700', color: '#0f172a', marginBottom: 16, marginTop: 8 },
  row:       { flexDirection: 'row', marginHorizontal: -6 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loading:   { color: '#94a3b8' },
});
