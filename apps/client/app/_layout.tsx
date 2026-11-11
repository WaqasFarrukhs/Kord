import { Slot, Link, usePathname } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, useWindowDimensions, Pressable } from 'react-native';
import House from 'lucide-react-native/icons/house';
import Radio from 'lucide-react-native/icons/radio';
import Settings2 from 'lucide-react-native/icons/settings-2';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, tokens, useTheme } from '../src/theme';
const queryClient = new QueryClient();
const links = [{ href: '/', title: 'Overview', icon: House }, { href: '/connection', title: 'Connection', icon: Radio }, { href: '/settings', title: 'Settings', icon: Settings2 }] as const;
function Shell() {
  const { colors, isDark } = useTheme();
  const desktop = useWindowDimensions().width >= tokens.breakpoint;
  const path = usePathname();
  const navigation = <View accessibilityLabel="Main navigation" style={[styles.navigation, { flexDirection: desktop ? 'column' : 'row', borderColor: colors.border, backgroundColor: colors.surface }, desktop ? styles.sidebar : styles.bottom]}>
    {desktop && <View style={styles.brand}><CalendarDays color={colors.accent} size={25} /><Text style={[styles.brandText, { color: colors.text }]}>Kord</Text></View>}
    {links.map(({ href, title, icon: Icon }) => <Link key={href} href={href} asChild><Pressable accessibilityRole="link" accessibilityState={{ selected: path === href }} style={StyleSheet.flatten([styles.navItem, { flexDirection: desktop ? 'row' : 'column', flex: desktop ? undefined : 1, backgroundColor: path === href ? colors.tint : 'transparent' }])}><Icon size={20} color={path === href ? colors.accent : colors.muted} /><Text style={{ fontSize: desktop ? 14 : 12, color: path === href ? colors.accent : colors.muted, fontWeight: '600' }}>{title}</Text></Pressable></Link>)}
    {desktop && <Text style={[styles.footer, { color: colors.muted }]}>Foundation · Phase 1</Text>}
  </View>;
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}><StatusBar style={isDark ? 'light' : 'dark'} /><View style={{ flex: 1, flexDirection: desktop ? 'row' : 'column' }}>{desktop && navigation}<View style={{ flex: 1 }}>{!desktop && <View style={[styles.mobileBrand, { borderColor: colors.border }]}><CalendarDays color={colors.accent} size={22} /><Text style={[styles.brandText, { color: colors.text }]}>Kord</Text></View>}<Slot /></View>{!desktop && navigation}</View></SafeAreaView>;
}
export default function Layout() { return <SafeAreaProvider><QueryClientProvider client={queryClient}><ThemeProvider><Shell /></ThemeProvider></QueryClientProvider></SafeAreaProvider>; }
const styles = StyleSheet.create({ navigation: { gap: 8, padding: 12 }, sidebar: { width: tokens.sidebar, borderRightWidth: 1, paddingTop: 32 }, bottom: { borderTopWidth: 1 }, brand: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, marginBottom: 36 }, brandText: { fontSize: 21, fontWeight: '700', letterSpacing: -0.6 }, mobileBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, borderBottomWidth: 1 }, navItem: { minHeight: 52, padding: 12, borderRadius: 8, alignItems: 'center', gap: 8 }, footer: { marginTop: 'auto', padding: 12, fontSize: 12 } });
