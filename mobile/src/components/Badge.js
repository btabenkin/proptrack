import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  available:    { bg: '#d1fae5', text: '#065f46' },
  rented:       { bg: '#dbeafe', text: '#1e40af' },
  maintenance:  { bg: '#fef3c7', text: '#92400e' },
  active:       { bg: '#d1fae5', text: '#065f46' },
  inactive:     { bg: '#f1f5f9', text: '#64748b' },
  evicted:      { bg: '#fee2e2', text: '#991b1b' },
  paid:         { bg: '#d1fae5', text: '#065f46' },
  late:         { bg: '#fee2e2', text: '#991b1b' },
  partial:      { bg: '#fef3c7', text: '#92400e' },
  open:         { bg: '#fee2e2', text: '#991b1b' },
  'in-progress':{ bg: '#fef3c7', text: '#92400e' },
  completed:    { bg: '#d1fae5', text: '#065f46' },
  cancelled:    { bg: '#f1f5f9', text: '#64748b' },
  low:          { bg: '#d1fae5', text: '#065f46' },
  medium:       { bg: '#fef3c7', text: '#92400e' },
  high:         { bg: '#fee2e2', text: '#991b1b' },
};

export default function Badge({ value }) {
  const c = COLORS[value] || { bg: '#f1f5f9', text: '#64748b' };
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.text, { color: c.text }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  text:  { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
});
