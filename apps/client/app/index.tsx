import { useRouter } from 'expo-router';
import { Page, Panel, Copy, Button } from '../src/ui';
export default function Overview() {
  const router = useRouter();
  return <Page title="A little more room for life." subtitle="One shared foundation for your family's schedules, routines, and everyday tasks.">
    <Panel><Copy heading>Welcome to Kord</Copy><Copy>The foundation is ready to explore. Start by checking that this device can reach your server.</Copy><Button title="Check connection" onPress={() => router.push('/connection')} /></Panel>
    <Panel><Copy heading>Built around your day</Copy><Copy>A responsive workspace for the web, Android, and iOS, with an appearance that follows your device.</Copy><Button title="Choose appearance" onPress={() => router.push('/settings')} /></Panel>
    <Copy>Phase 1 · Accounts and workspaces are next. Tasks and calendars will follow after access controls are in place.</Copy>
  </Page>;
}
