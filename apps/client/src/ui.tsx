import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tokens, useTheme } from './theme';
export function Page({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  const { colors } = useTheme();
  return <ScrollView contentContainerStyle={styles.page}><View style={styles.content}>
    <Text style={[styles.eyebrow, { color: colors.accent }]}>YOUR SPACE, SIMPLIFIED</Text>
    <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>{title}</Text>
    <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
    {children}
  </View></ScrollView>;
}
export function Panel({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>;
}
export function Copy({ children, heading = false }: PropsWithChildren<{ heading?: boolean }>) {
  const { colors } = useTheme();
  return <Text accessibilityRole={heading ? 'header' : undefined} style={{ color: heading ? colors.text : colors.muted, fontSize: heading ? 19 : 15, fontWeight: heading ? '600' : '400', lineHeight: heading ? 28 : 24 }}>{children}</Text>;
}
export function Button({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { borderColor: colors.accent, backgroundColor: colors.tint, opacity: disabled || pressed ? 0.6 : 1 }]}><Text style={{ color: colors.accent, fontWeight: '600', fontSize: 15 }}>{title}</Text></Pressable>;
}
const styles = StyleSheet.create({
  page: { padding: tokens.space.lg, flexGrow: 1 }, content: { maxWidth: 900, width: '100%', alignSelf: 'center', gap: tokens.space.md, paddingTop: tokens.space.lg },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }, title: { fontSize: 32, fontWeight: '600', letterSpacing: -0.8 },
  subtitle: { fontSize: 16, lineHeight: 25, marginBottom: tokens.space.md },
  panel: { borderWidth: 1, borderRadius: tokens.radius, padding: tokens.space.lg, gap: tokens.space.md },
  button: { borderWidth: 1, borderRadius: 8, minHeight: tokens.touchTarget, paddingHorizontal: tokens.space.md, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
});
