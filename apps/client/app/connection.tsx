import { Text, View } from 'react-native';
import { Page, Panel, Copy, Button } from '../src/ui';
import { useConnection } from '../src/connection';
import { useTheme } from '../src/theme';
export default function Connection() {
  const query = useConnection();
  const { colors } = useTheme();
  const error = query.configurationError || query.error?.message;
  return <Page title="Connection" subtitle="Check the connection from this device to your Kord server.">
    <Panel><Copy heading>{query.isFetching ? 'Checking connection…' : error ? 'Connection needs attention' : query.data ? 'API connected' : 'Ready to check'}</Copy>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error, lineHeight: 24 }}>{error}</Text> : query.data && <View style={{ gap: 12 }}><Copy>{query.data.databaseReady ? 'Database ready · the initial migration is available.' : 'Database unavailable · check PostgreSQL and run the migrations.'}</Copy><Copy>Last checked: {new Date(query.data.checkedAt).toLocaleTimeString()}</Copy></View>}
      <Button title={query.isFetching ? 'Checking…' : 'Check again'} disabled={query.isFetching || Boolean(query.configurationError)} onPress={() => { void query.refetch(); }} />
    </Panel>
    <Panel><Copy heading>Server address</Copy><Text selectable style={{ color: colors.text, fontSize: 14 }}>{query.base || 'Not configured'}</Text><Copy>For a physical phone, configure the server's LAN address or HTTPS domain before starting Expo. The phone and server must be able to reach each other.</Copy></Panel>
  </Page>;
}
