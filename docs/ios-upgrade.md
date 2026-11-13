# iOS testing with Xcode 27

Kord uses Expo SDK 58, React 19.3 and React Native 0.88. The iOS minimum is 17.0, configured in `apps/client/app.json`. Use Node 24.3 or newer within the 24.x line and pnpm 11.25.0. Xcode 27 manages simulators through Device Hub.

## Why the upgrade was needed

On the Mac, SDK 55's launcher could not locate Simulator.app after Xcode 27 replaced it with Device Hub. Building directly with Xcode got past that problem, but Kord then stopped at `UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`. SDK 58 generates scene-based startup and recognises Device Hub. Raising the deployment target alone does not provide scene support.

The SDK 55 native build also had different app and Expo deployment targets. The shared configuration now declares 17.0, replacing the temporary 17.6 edit in the Mac's generated Xcode project. Native project generation was checked on Linux; compiling, installing and launching iOS still requires the Mac.

## Update the Mac copy

Quit Xcode and stop the old Expo server with Control-C. In the Mac Terminal:

```sh
cd "/Users/waqas/2-Work/3-AI-Dev/Kord"
git status --short
git fetch origin
git switch --track origin/codex/expo-58-xcode-27
```

If Git reports tracked local changes or refuses to switch, inspect them before continuing; do not discard them. If the upgrade branch already exists locally, use `git switch codex/expo-58-xcode-27` followed by `git pull --ff-only`.

Install the exact dependencies:

```sh
pnpm install --frozen-lockfile
pnpm --filter @kord/client exec expo install --check
```

If Expo Doctor reports duplicate SDK 55 packages after installation, stop development servers, remove only the generated root `node_modules` directory, and repeat the frozen-lockfile install. A clean dependency installation resolved stale nested log-box packages on SPC2. Do not delete the lockfile or environment files.

## Regenerate the iOS project

The ignored `apps/client/ios` directory was generated for SDK 55. It must be regenerated; opening its old workspace will not add the new startup code. Preserve the old native source/settings in a small archive first (excluding downloaded Pods and build products):

```sh
tar -czf "$HOME/kord-ios-before-sdk58-$(date +%Y%m%d-%H%M%S).tgz" \
  --exclude='ios/Pods' --exclude='ios/build' -C apps/client ios
pnpm --filter @kord/client exec expo prebuild --clean --platform ios
```

`--clean` replaces the generated iOS directory, including the earlier manual deployment-target edits. It does not replace Kord's shared screens or the Android project. It installs CocoaPods dependencies on the Mac. The regenerated project must contain `SceneDelegate.swift`, `UIApplicationSceneManifest` in Info.plist, and `ios.deploymentTarget: 17.0` in Podfile.properties.json.

Build and choose an available iPhone simulator:

```sh
pnpm --filter @kord/client ios --device
```

Keep the terminal open. If using Xcode directly, reopen the newly generated `apps/client/ios/Kord.xcworkspace`, keep `pnpm --filter @kord/client dev` running in another terminal, and run the Kord scheme on an iPhone simulator. A first build may take longer because native dependencies changed.

## Connect and test

First confirm that Overview, Settings and Connection render without a startup crash. For the API on SPC2, set `EXPO_PUBLIC_API_URL` in the Mac client's local `.env` to SPC2's reachable LAN address, including port 3000, and restart Expo. `localhost` on the Mac points to the Mac, not SPC2; `10.0.2.2` is the Android emulator host alias and is not appropriate here. Keep `.env` out of Git.

Verify API connected and Database ready, then database stop/restart recovery. Test navigation, both appearance switches, device-theme following, portrait/landscape layout and basic VoiceOver navigation. Further copy and announcement polish remains deferred. Record actual results before marking Phase 1 complete.

Android also needs a fresh SDK 58 native build and a repeat of its smoke tests; the previously installed SDK 55 binary does not validate this upgrade. Preserve any local native edits before regenerating Android, including the machine's SDK path settings.

## References

- [Expo SDK 58 release notes](https://expo.dev/changelog/sdk-58)
- [Expo scene lifecycle migration](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md)
- [Expo SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
