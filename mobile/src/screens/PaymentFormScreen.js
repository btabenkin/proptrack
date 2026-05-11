import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { rentPaymentsApi, tenantsApi, propertiesApi } from '../services/api';

export default function PaymentFormScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    tenantId: existing?.tenantId?._id || existing?.tenantId || '',
    propertyId: existing?.propertyId?._id || existing?.propertyId || '',
    amount: existing?.amount?.toString() || '',
    paymentDate: existing?.paymentDate?.slice(0, 10) || '',
    period: existing?.period || '',
    status: existing?.status || 'paid',
    paymentMethod: existing?.paymentMethod || 'bank transfer',
    notes: existing?.notes || '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([tenantsApi.getAll(), propertiesApi.getAll()])
      .then(([t, p]) => { setTenants(t.data); setProperties(p.data); }).catch(() => {});
  }, []);

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    try {
      if (existing) { await rentPaymentsApi.update(existing._id, form); }
      else { await rentPaymentsApi.create(form); }
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>{existing ? 'Edit Payment' : 'Record Payment'}</Text>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <Text style={s.label}>Tenant *</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.tenantId} onValueChange={f('tenantId')}>
          <Picker.Item label="Select tenant…" value="" />
          {tenants.map(t => <Picker.Item key={t._id} label={`${t.firstName} ${t.lastName}`} value={t._id} />)}
        </Picker>
      </View>

      <Text style={s.label}>Property *</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.propertyId} onValueChange={f('propertyId')}>
          <Picker.Item label="Select property…" value="" />
          {properties.map(p => <Picker.Item key={p._id} label={p.address} value={p._id} />)}
        </Picker>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Amount *</Text>
          <TextInput style={s.input} value={form.amount} onChangeText={f('amount')} keyboardType="numeric" placeholder="1500" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Period *</Text>
          <TextInput style={s.input} value={form.period} onChangeText={f('period')} placeholder="May 2025" />
        </View>
      </View>

      <Text style={s.label}>Payment Date *</Text>
      <TextInput style={s.input} value={form.paymentDate} onChangeText={f('paymentDate')} placeholder="2025-05-01" />

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Method</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.paymentMethod} onValueChange={f('paymentMethod')} style={s.picker}>
              {['bank transfer','check','cash','venmo','zelle','other'].map(m => <Picker.Item key={m} label={m} value={m} />)}
            </Picker>
          </View>
        </View>
        <View style={s.half}>
          <Text style={s.label}>Status</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.status} onValueChange={f('status')} style={s.picker}>
              <Picker.Item label="Paid" value="paid" />
              <Picker.Item label="Late" value="late" />
              <Picker.Item label="Partial" value="partial" />
            </Picker>
          </View>
        </View>
      </View>

      <Text style={s.label}>Notes</Text>
      <TextInput style={[s.input, s.textarea]} value={form.notes} onChangeText={f('notes')} multiline placeholder="Optional notes…" />

      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnTxt}>{existing ? 'Update Payment' : 'Record Payment'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  title:      { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  label:      { fontSize: 11, fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  input:      { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1e293b' },
  textarea:   { height: 80, textAlignVertical: 'top' },
  pickerWrap: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  picker:     { height: 44 },
  row:        { flexDirection: 'row', gap: 10 },
  half:       { flex: 1 },
  btn:        { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 15 },
  error:      { backgroundColor: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
});
