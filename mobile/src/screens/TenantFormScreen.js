import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { tenantsApi, propertiesApi } from '../services/api';

export default function TenantFormScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    propertyId: existing?.propertyId?._id || existing?.propertyId || '',
    firstName: existing?.firstName || '',
    lastName: existing?.lastName || '',
    email: existing?.email || '',
    phone: existing?.phone || '',
    leaseStart: existing?.leaseStart?.slice(0, 10) || '',
    leaseEnd: existing?.leaseEnd?.slice(0, 10) || '',
    monthlyRent: existing?.monthlyRent?.toString() || '',
    securityDeposit: existing?.securityDeposit?.toString() || '',
    status: existing?.status || 'active',
  });
  const [error, setError] = useState('');

  useEffect(() => { propertiesApi.getAll().then(r => setProperties(r.data)).catch(() => {}); }, []);

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    try {
      if (existing) { await tenantsApi.update(existing._id, form); }
      else { await tenantsApi.create(form); }
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>{existing ? 'Edit Tenant' : 'Add Tenant'}</Text>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <Text style={s.label}>Property *</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.propertyId} onValueChange={f('propertyId')}>
          <Picker.Item label="Select a property…" value="" />
          {properties.map(p => <Picker.Item key={p._id} label={`${p.address}, ${p.city}`} value={p._id} />)}
        </Picker>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>First Name *</Text>
          <TextInput style={s.input} value={form.firstName} onChangeText={f('firstName')} placeholder="Jane" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Last Name *</Text>
          <TextInput style={s.input} value={form.lastName} onChangeText={f('lastName')} placeholder="Smith" />
        </View>
      </View>

      <Text style={s.label}>Email *</Text>
      <TextInput style={s.input} value={form.email} onChangeText={f('email')} keyboardType="email-address" autoCapitalize="none" placeholder="jane@email.com" />

      <Text style={s.label}>Phone *</Text>
      <TextInput style={s.input} value={form.phone} onChangeText={f('phone')} keyboardType="phone-pad" placeholder="555-1234" />

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Lease Start *</Text>
          <TextInput style={s.input} value={form.leaseStart} onChangeText={f('leaseStart')} placeholder="2025-01-01" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Lease End *</Text>
          <TextInput style={s.input} value={form.leaseEnd} onChangeText={f('leaseEnd')} placeholder="2026-01-01" />
        </View>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Monthly Rent *</Text>
          <TextInput style={s.input} value={form.monthlyRent} onChangeText={f('monthlyRent')} keyboardType="numeric" placeholder="1500" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Security Deposit</Text>
          <TextInput style={s.input} value={form.securityDeposit} onChangeText={f('securityDeposit')} keyboardType="numeric" placeholder="1500" />
        </View>
      </View>

      <Text style={s.label}>Status</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.status} onValueChange={f('status')}>
          <Picker.Item label="Active" value="active" />
          <Picker.Item label="Inactive" value="inactive" />
          <Picker.Item label="Evicted" value="evicted" />
        </Picker>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnTxt}>{existing ? 'Update Tenant' : 'Create Tenant'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  title:      { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  label:      { fontSize: 11, fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  input:      { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1e293b' },
  pickerWrap: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  row:        { flexDirection: 'row', gap: 10 },
  half:       { flex: 1 },
  btn:        { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 15 },
  error:      { backgroundColor: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
});
