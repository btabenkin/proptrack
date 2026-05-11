import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { propertiesApi } from '../services/api';

export default function PropertiesScreen({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [estimating, setEstimating] = useState(null);

  const load = async () => {
    try { const r = await propertiesApi.getAll(); setProperties(r.data); } catch {}
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleDelete = (id, address) => {
    Alert.alert('Delete Property', `Delete ${address}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await propertiesApi.remove(id); load(); } },
    ]);
  };

  const handleEstimate = async (item) => {
    setEstimating(item._id);
    try {
      const r = await propertiesApi.getRentEstimate(item._id);
      setEstimate({ property: item, data: r.data });
    } catch (err) {
      Alert.alert('Estimate Unavailable', err.response?.data?.message || 'Could not fetch rent estimate.');
    } finally {
      setEstimating(null);
    }
  };

  return (
    <View style={s.container}>
      <FlatList
        data={properties}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="No properties yet. Tap + to add one." />}
        contentContainerStyle={properties.length === 0 && { flex: 1 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.address}>{item.address}</Text>
              <Badge value={item.status} />
            </View>
            <Text style={s.sub}>{item.city}, {item.state} {item.zip}</Text>
            <Text style={s.meta}>{item.bedrooms}bd · {item.bathrooms}ba · {item.squareFeet?.toLocaleString()} sqft</Text>
            <Text style={s.price}>${item.purchasePrice?.toLocaleString()}</Text>
            <View style={s.actions}>
              <TouchableOpacity
                style={[s.estimateBtn, estimating === item._id && s.disabledBtn]}
                onPress={() => handleEstimate(item)}
                disabled={estimating === item._id}
              >
                {estimating === item._id
                  ? <ActivityIndicator size="small" color="#15803d" />
                  : <Text style={s.estimateTxt}>💡 Rent Estimate</Text>
                }
              </TouchableOpacity>
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('PropertyForm', { item })}>
                <Text style={s.editTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.delBtn} onPress={() => handleDelete(item._id, item.address)}>
                <Text style={s.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('PropertyForm', {})}>
        <Text style={s.fabTxt}>+</Text>
      </TouchableOpacity>

      {/* Rent Estimate Modal */}
      <Modal visible={!!estimate} animationType="slide" transparent onRequestClose={() => setEstimate(null)}>
        <View style={s.sheetOverlay}>
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.sheetTitle}>Rent Estimate</Text>
                {estimate && <Text style={s.sheetSub}>{estimate.property.address}, {estimate.property.city}</Text>}
              </View>
              <TouchableOpacity onPress={() => setEstimate(null)} style={s.closeBtn}>
                <Text style={s.closeTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            {estimate && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={s.hero}>
                  <View style={s.heroMain}>
                    <Text style={s.heroLabel}>Estimated Market Rent</Text>
                    <Text style={s.heroValue}>${estimate.data.rent?.toLocaleString()}<Text style={s.heroUnit}>/mo</Text></Text>
                  </View>
                  <View style={s.heroRange}>
                    <View style={s.rangeItem}>
                      <Text style={s.rangeLabel}>Low</Text>
                      <Text style={s.rangeValue}>${estimate.data.rentRangeLow?.toLocaleString()}</Text>
                    </View>
                    <Text style={s.rangeDash}>—</Text>
                    <View style={s.rangeItem}>
                      <Text style={s.rangeLabel}>High</Text>
                      <Text style={s.rangeValue}>${estimate.data.rentRangeHigh?.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>

                {/* Comparables */}
                {estimate.data.comparables?.length > 0 && (
                  <View style={s.compsSection}>
                    <Text style={s.compsTitle}>Nearby Comparables</Text>
                    {estimate.data.comparables.map((c, i) => (
                      <View key={i} style={s.compRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.compAddress}>{c.address}</Text>
                          <Text style={s.compMeta}>{c.bedrooms}bd · {c.bathrooms}ba · {c.squareFootage?.toLocaleString()} sqft · {c.distance?.toFixed(1)} mi away</Text>
                        </View>
                        <Text style={s.compRent}>${c.rent?.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={s.attribution}>Data provided by Rentcast</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f1f5f9' },
  card:        { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  address:     { fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1, marginRight: 8 },
  sub:         { fontSize: 13, color: '#64748b', marginBottom: 2 },
  meta:        { fontSize: 13, color: '#64748b', marginBottom: 4 },
  price:       { fontSize: 15, fontWeight: '600', color: '#1d4ed8', marginBottom: 10 },
  actions:     { flexDirection: 'row', gap: 8, marginBottom: 6 },
  estimateBtn: { flex: 1, backgroundColor: '#f0fdf4', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#bbf7d0' },
  estimateTxt: { color: '#15803d', fontWeight: '600', fontSize: 13 },
  disabledBtn: { opacity: 0.6 },
  editBtn:     { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  editTxt:     { color: '#374151', fontWeight: '500', fontSize: 13 },
  delBtn:      { flex: 1, backgroundColor: '#fef2f2', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  delTxt:      { color: '#ef4444', fontWeight: '500', fontSize: 13 },
  fab:         { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#3b82f6', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabTxt:      { color: '#fff', fontSize: 28, lineHeight: 32 },

  // Bottom sheet
  sheetOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.5)' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  sheetHandle:  { width: 36, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  sheetTitle:   { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  sheetSub:     { fontSize: 12, color: '#64748b', marginTop: 2 },
  closeBtn:     { padding: 4 },
  closeTxt:     { fontSize: 16, color: '#94a3b8' },

  // Hero
  hero:       { backgroundColor: '#1d4ed8', borderRadius: 14, padding: 20, marginBottom: 20 },
  heroMain:   { marginBottom: 14 },
  heroLabel:  { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  heroValue:  { fontSize: 36, fontWeight: '800', color: '#fff' },
  heroUnit:   { fontSize: 16, fontWeight: '400', color: 'rgba(255,255,255,0.75)' },
  heroRange:  { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 12, gap: 12 },
  rangeItem:  { alignItems: 'center', flex: 1 },
  rangeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 2 },
  rangeValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  rangeDash:  { color: 'rgba(255,255,255,0.5)', fontSize: 16 },

  // Comparables
  compsSection: { marginBottom: 16 },
  compsTitle:   { fontSize: 11, fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  compRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  compAddress:  { fontSize: 13, fontWeight: '500', color: '#1e293b', marginBottom: 2 },
  compMeta:     { fontSize: 11, color: '#94a3b8' },
  compRent:     { fontSize: 15, fontWeight: '700', color: '#1d4ed8', marginLeft: 8 },
  attribution:  { fontSize: 11, color: '#cbd5e1', textAlign: 'right', marginBottom: 8 },
});
