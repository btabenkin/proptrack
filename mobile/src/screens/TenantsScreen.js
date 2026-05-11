import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { tenantsApi } from '../services/api';

export default function TenantsScreen({ navigation }) {
  const [tenants, setTenants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const r = await tenantsApi.getAll(); setTenants(r.data); } catch {}
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id, name) => {
    Alert.alert('Delete Tenant', `Delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await tenantsApi.remove(id); load(); } },
    ]);
  };

  return (
    <View style={s.container}>
      <FlatList
        data={tenants}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="No tenants yet. Tap + to add one." />}
        contentContainerStyle={tenants.length === 0 && { flex: 1 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.name}>{item.firstName} {item.lastName}</Text>
              <Badge value={item.status} />
            </View>
            <Text style={s.property}>{item.propertyId?.address || '—'}</Text>
            <Text style={s.meta}>{item.email}</Text>
            <Text style={s.meta}>{item.phone}</Text>
            <View style={s.rentRow}>
              <Text style={s.rent}>${item.monthlyRent?.toLocaleString()}/mo</Text>
              {item.leaseEnd && <Text style={s.meta}>Lease ends {new Date(item.leaseEnd).toLocaleDateString()}</Text>}
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('TenantForm', { item })}>
                <Text style={s.editTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item._id, `${item.firstName} ${item.lastName}`)}>
                <Text style={s.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('TenantForm', {})}>
        <Text style={s.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  card:      { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  cardHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  name:      { fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1, marginRight: 8 },
  property:  { fontSize: 13, color: '#1d4ed8', marginBottom: 4 },
  meta:      { fontSize: 13, color: '#64748b', marginBottom: 2 },
  rentRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 12 },
  rent:      { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  actions:   { flexDirection: 'row', gap: 8 },
  editBtn:   { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  editTxt:   { color: '#374151', fontWeight: '500', fontSize: 13 },
  delBtn:    { flex: 1, backgroundColor: '#fef2f2', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  delTxt:    { color: '#ef4444', fontWeight: '500', fontSize: 13 },
  fab:       { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#3b82f6', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabTxt:    { color: '#fff', fontSize: 28, lineHeight: 32 },
});
