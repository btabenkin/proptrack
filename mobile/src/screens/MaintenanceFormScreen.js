import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { maintenanceApi, propertiesApi, tenantsApi } from '../services/api';

export default function MaintenanceFormScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    propertyId: existing?.propertyId?._id || existing?.propertyId || '',
    tenantId: existing?.tenantId?._id || existing?.tenantId || '',
    title: existing?.title || '',
    description: existing?.description || '',
    status: existing?.status || 'open',
    priority: existing?.priority || 'medium',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([propertiesApi.getAll(), tenantsApi.getAll()])
      .then(([p, t]) => { setProperties(p.data); setTenants(t.data); }).catch(() => {});
  }, []);

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    try {
      const data = { ...form, tenantId: form.tenantId || undefined };
      if (existing) { await maintenanceApi.update(existing._id, data); }
      else { await maintenanceApi.create(data); }
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>{existing ? 'Edit Request' : 'New Maintenance Request'}</Text>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <Text style={s.label}>Property *</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.propertyId} onValueChange={f('propertyId')}>
          <Picker.Item label="Select property…" value="" />
          {properties.map(p => <Picker.Item key={p._id} label={p.address} value={p._id} />)}
        </Picker>
      </View>

      <Text style={s.label}>Tenant (optional)</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={form.tenantId} onValueChange={f('tenantId')}>
          <Picker.Item label="None" value="" />
          {tenants.map(t => <Picker.Item key={t._id} label={`${t.firstName} ${t.lastName}`} value={t._id} />)}
        </Picker>
      </View>

      <Text style={s.label}>Title *</Text>
      <TextInput style={s.input} value={form.title} onChangeText={f('title')} placeholder="Leaking faucet" />

      <Text style={s.label}>Description *</Text>
      <TextInput style={[s.input, s.textarea]} value={form.description} onChangeText={f('description')} multiline placeholder="Describe the issue…" />

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Priority</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.priority} onValueChange={f('priority')} style={s.picker}>
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </View>
        </View>
        <View style={s.half}>
          <Text style={s.label}>Status</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.status} onValueChange={f('status')} style={s.picker}>
              <Picker.Item label="Open" value="open" />
              <Picker.Item label="In Progress" value="in-progress" />
              <Picker.Item label="Completed" value="completed" />
              <Picker.Item label="Cancelled" value="cancelled" />
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnTxt}>{existing ? 'Update Request' : 'Create Request'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  title:      { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  label:      { fontSize: 11, fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  input:      { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1e293b' },
  textarea:   { height: 100, textAlignVertical: 'top' },
  pickerWrap: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  picker:     { height: 44 },
  row:        { flexDirection: 'row', gap: 10 },
  half:       { flex: 1 },
  btn:        { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 15 },
  error:      { backgroundColor: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
});
