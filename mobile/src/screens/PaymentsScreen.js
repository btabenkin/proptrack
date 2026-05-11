import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { rentPaymentsApi } from '../services/api';

export default function PaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const r = await rentPaymentsApi.getAll(); setPayments(r.data); } catch {}
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id) => {
    Alert.alert('Delete Payment', 'Delete this payment record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await rentPaymentsApi.remove(id); load(); } },
    ]);
  };

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <View style={s.container}>
      {payments.length > 0 && (
        <View style={s.summary}><Text style={s.summaryTxt}>Total collected: <Text style={s.summaryVal}>${total.toLocaleString()}</Text></Text></View>
      )}
      <FlatList
        data={payments}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="No payments recorded yet." />}
        contentContainerStyle={payments.length === 0 && { flex: 1 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.amount}>${item.amount?.toLocaleString()}</Text>
              <Badge value={item.status} />
            </View>
            <Text style={s.period}>{item.period}</Text>
            <Text style={s.meta}>{item.tenantId ? `${item.tenantId.firstName} ${item.tenantId.lastName}` : '—'}</Text>
            <Text style={s.meta}>{item.propertyId?.address || '—'}</Text>
            <View style={s.footer}>
              <Text style={s.method}>{item.paymentMethod}</Text>
              <Text style={s.meta}>{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : ''}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('PaymentForm', { item })}>
                <Text style={s.editTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item._id)}>
                <Text style={s.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('PaymentForm', {})}>
        <Text style={s.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  summary:   { backgroundColor: '#fff', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryTxt:{ fontSize: 13, color: '#64748b' },
  summaryVal:{ fontWeight: '700', color: '#0f172a' },
  card:      { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  cardHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  amount:    { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  period:    { fontSize: 14, fontWeight: '600', color: '#1d4ed8', marginBottom: 4 },
  meta:      { fontSize: 13, color: '#64748b', marginBottom: 2 },
  footer:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  method:    { fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' },
  actions:   { flexDirection: 'row', gap: 8 },
  editBtn:   { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  editTxt:   { color: '#374151', fontWeight: '500', fontSize: 13 },
  delBtn:    { flex: 1, backgroundColor: '#fef2f2', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  delTxt:    { color: '#ef4444', fontWeight: '500', fontSize: 13 },
  fab:       { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#3b82f6', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabTxt:    { color: '#fff', fontSize: 28, lineHeight: 32 },
});
