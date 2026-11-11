import { useRouter } from 'expo-router';
import { Page, Button } from '../src/ui';
export default function NotFound() { const router = useRouter(); return <Page title="Page not found" subtitle="This address is not part of your workspace."><Button title="Go to overview" onPress={() => router.replace('/')} /></Page>; }
