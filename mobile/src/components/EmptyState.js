import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ message }) {
  return (
    <View style={s.container}>
      <Text style={s.text}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  text: { color: '#94a3b8', fontSize: 15, textAlign: 'center' },
});
