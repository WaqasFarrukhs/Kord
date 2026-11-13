import { StyleSheet, Switch, View } from 'react-native';
import Sun from 'lucide-react-native/icons/sun';
import Moon from 'lucide-react-native/icons/moon';
import { Page, Panel, Copy } from '../src/ui';
import { tokens, useTheme } from '../src/theme';

export default function Settings() {
  const { mode, setMode, isDark, colors } = useTheme();
  return <Page title="Make yourself at home." subtitle="A clear, comfortable workspace on every screen.">
    <Panel>
      <Copy heading>Appearance</Copy>
      <View style={styles.row}>
        <View style={styles.label}>
          <Copy heading>Follow device theme</Copy>
          <Copy>Automatically match your device’s light or dark appearance.</Copy>
        </View>
        <View style={styles.switch}><Switch
          accessibilityLabel="Follow device theme"
          value={mode === 'system'}
          onValueChange={followDevice => setMode(followDevice ? 'system' : isDark ? 'dark' : 'light')}
          trackColor={{ false: colors.border, true: colors.accent }}
          hitSlop={12}
        /></View>
      </View>
      <View style={styles.row}>
        <View style={styles.label}>
          <Copy heading>Dark Mode</Copy>
          <View aria-hidden style={styles.themeIcons}>
            <Sun size={20} color={colors.text} strokeWidth={isDark ? 1.5 : 3} />
            <Moon size={20} color={colors.text} strokeWidth={isDark ? 3 : 1.5} />
          </View>
        </View>
        <View style={styles.switch}><Switch
          accessibilityLabel="Dark mode"
          accessibilityHint="Off selects light. On selects dark. Changing this turns off Follow device theme."
          value={isDark}
          onValueChange={dark => setMode(dark ? 'dark' : 'light')}
          trackColor={{ false: colors.border, true: colors.accent }}
          hitSlop={12}
        /></View>
      </View>
      <Copy>This preference applies for the current app session.</Copy>
    </Panel>
  </Page>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: tokens.space.md },
  label: { flex: 1, gap: tokens.space.xs },
  themeIcons: { flexDirection: 'row', gap: tokens.space.sm },
  switch: { minWidth: tokens.touchTarget, minHeight: tokens.touchTarget, alignItems: 'center', justifyContent: 'center' },
});
