import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { propertiesApi } from '../services/api';

export default function PropertyFormScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [form, setForm] = useState({
    address: existing?.address || '',
    city: existing?.city || '',
    state: existing?.state || '',
    zip: existing?.zip || '',
    bedrooms: existing?.bedrooms?.toString() || '',
    bathrooms: existing?.bathrooms?.toString() || '',
    squareFeet: existing?.squareFeet?.toString() || '',
    purchasePrice: existing?.purchasePrice?.toString() || '',
    currentValue: existing?.currentValue?.toString() || '',
    status: existing?.status || 'available',
  });
  const [error, setError] = useState('');

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    try {
      if (existing) { await propertiesApi.update(existing._id, form); }
      else { await propertiesApi.create(form); }
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>{existing ? 'Edit Property' : 'Add Property'}</Text>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <Text style={s.label}>Address *</Text>
      <TextInput style={s.input} value={form.address} onChangeText={f('address')} placeholder="123 Main St" />

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>City *</Text>
          <TextInput style={s.input} value={form.city} onChangeText={f('city')} placeholder="City" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>State *</Text>
          <TextInput style={s.input} value={form.state} onChangeText={f('state')} placeholder="CA" />
        </View>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Zip *</Text>
          <TextInput style={s.input} value={form.zip} onChangeText={f('zip')} placeholder="90210" keyboardType="numeric" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Status</Text>
          <View style={s.pickerWrap}>
            <Picker selectedValue={form.status} onValueChange={f('status')} style={s.picker}>
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Rented" value="rented" />
              <Picker.Item label="Maintenance" value="maintenance" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={s.row}>
        <View style={s.third}>
          <Text style={s.label}>Beds *</Text>
          <TextInput style={s.input} value={form.bedrooms} onChangeText={f('bedrooms')} keyboardType="numeric" placeholder="3" />
        </View>
        <View style={s.third}>
          <Text style={s.label}>Baths *</Text>
          <TextInput style={s.input} value={form.bathrooms} onChangeText={f('bathrooms')} keyboardType="decimal-pad" placeholder="2" />
        </View>
        <View style={s.third}>
          <Text style={s.label}>Sq Ft *</Text>
          <TextInput style={s.input} value={form.squareFeet} onChangeText={f('squareFeet')} keyboardType="numeric" placeholder="1200" />
        </View>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={s.label}>Purchase Price *</Text>
          <TextInput style={s.input} value={form.purchasePrice} onChangeText={f('purchasePrice')} keyboardType="numeric" placeholder="350000" />
        </View>
        <View style={s.half}>
          <Text style={s.label}>Current Value</Text>
          <TextInput style={s.input} value={form.currentValue} onChangeText={f('currentValue')} keyboardType="numeric" placeholder="400000" />
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnTxt}>{existing ? 'Update Property' : 'Create Property'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  title:      { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  label:      { fontSize: 11, fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  input:      { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1e293b' },
  pickerWrap: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' },
  picker:     { height: 44 },
  row:        { flexDirection: 'row', gap: 10 },
  half:       { flex: 1 },
  third:      { flex: 1 },
  btn:        { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  btnTxt:     { color: '#fff', fontWeight: '600', fontSize: 15 },
  error:      { backgroundColor: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
});
