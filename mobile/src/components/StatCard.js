import { View, Text, StyleSheet } from 'react-native';

const ACCENT = { blue: '#3b82f6', green: '#10b981', red: '#ef4444', orange: '#f59e0b' };

export default function StatCard({ label, value, color = 'blue' }) {
  return (
    <View style={[s.card, { borderLeftColor: ACCENT[color] }]}>
      <Text style={s.value}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card:  { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, flex: 1, margin: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  value: { fontSize: 26, fontWeight: '700', color: '#0f172a' },
  label: { fontSize: 11, color: '#64748b', marginTop: 2, fontWeight: '500' },
});
