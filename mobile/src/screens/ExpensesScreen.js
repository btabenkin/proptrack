import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { expensesApi } from '../services/api';

export default function ExpensesScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const r = await expensesApi.getAll(); setExpenses(r.data); } catch {}
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await expensesApi.remove(id); load(); } },
    ]);
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <View style={s.container}>
      {expenses.length > 0 && (
        <View style={s.summary}><Text style={s.summaryTxt}>Total: <Text style={s.summaryVal}>${total.toLocaleString()}</Text></Text></View>
      )}
      <FlatList
        data={expenses}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="No expenses recorded yet." />}
        contentContainerStyle={expenses.length === 0 && { flex: 1 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.amount}>${item.amount?.toLocaleString()}</Text>
              <Badge value={item.category} />
            </View>
            <Text style={s.description}>{item.description}</Text>
            <Text style={s.meta}>{item.propertyId?.address || '—'}</Text>
            {item.vendor ? <Text style={s.meta}>Vendor: {item.vendor}</Text> : null}
            <Text style={s.date}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
            <View style={s.actions}>
              <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('ExpenseForm', { item })}>
                <Text style={s.editTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item._id)}>
                <Text style={s.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('ExpenseForm', {})}>
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
  description:{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  meta:      { fontSize: 13, color: '#64748b', marginBottom: 2 },
  date:      { fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 12 },
  actions:   { flexDirection: 'row', gap: 8 },
  editBtn:   { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  editTxt:   { color: '#374151', fontWeight: '500', fontSize: 13 },
  delBtn:    { flex: 1, backgroundColor: '#fef2f2', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  delTxt:    { color: '#ef4444', fontWeight: '500', fontSize: 13 },
  fab:       { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#3b82f6', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabTxt:    { color: '#fff', fontSize: 28, lineHeight: 32 },
});
