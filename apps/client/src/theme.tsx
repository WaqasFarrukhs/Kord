import { createContext, useContext, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import { Appearance } from 'react-native';
export const tokens = { space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }, radius: 12, sidebar: 232, breakpoint: 850, touchTarget: 48 } as const;
const light = { background: '#F7F8FA', surface: '#FFFFFF', text: '#202B36', muted: '#586776', border: '#DDE3E9', accent: '#23654E', tint: '#E8F1EC', error: '#A52D34' };
const dark: typeof light = { background: '#12191F', surface: '#1B252E', text: '#EDF2F5', muted: '#ACBAC7', border: '#34424F', accent: '#9CD9BD', tint: '#223E33', error: '#FFABAE' };
type Mode = 'system' | 'light' | 'dark';
const ThemeContext = createContext({ colors: light, mode: 'system' as Mode, isDark: false, setMode: (_mode: Mode) => {} });
function subscribeToAppearance(onChange: () => void) {
  const subscription = Appearance.addChangeListener(onChange);
  return () => subscription.remove();
}
export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useSyncExternalStore(subscribeToAppearance, Appearance.getColorScheme, () => 'light');
  const [mode, setMode] = useState<Mode>('system');
  const isDark = (mode === 'system' ? system : mode) === 'dark';
  return <ThemeContext.Provider value={{ colors: isDark ? dark : light, mode, setMode, isDark }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
