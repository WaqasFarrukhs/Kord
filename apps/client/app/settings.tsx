import { View } from 'react-native';
import { Page, Panel, Copy, Button } from '../src/ui';
import { useTheme } from '../src/theme';
export default function Settings() {
  const { mode, setMode } = useTheme();
  return <Page title="Make yourself at home." subtitle="A clear, comfortable workspace on every screen."><Panel><Copy heading>Appearance</Copy><Copy>Current preference: {mode}. This preference applies for the current app session.</Copy><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{(['system', 'light', 'dark'] as const).map(value => <Button key={value} title={value === 'system' ? 'Use device setting' : value === 'light' ? 'Light' : 'Dark'} disabled={mode === value} onPress={() => setMode(value)} />)}</View></Panel></Page>;
}
