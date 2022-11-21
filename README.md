# Example repo

## installation

We need to use version 11 of jdk

```
[ -s "/Users/mike/.jabba/jabba.sh" ] && source "/Users/mike/.jabba/jabba.sh" && jabba use zulu@1.11.0-10
```

If you are testing the react native release, then run the following in the package directory

```cd react-native-tapresearch && npm link```

Then link in the this directory `npm link react-native-tapresearch` and add the following to the dependencies section in package.json
`"react-native-tapresearch": "file:../react-native-tapresearch"`

### Running the example

```
export RCT_METRO_PORT=8088
# This is for adb and stuff
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

Run the thing `npx react-native start` <- This starts a listener for reloads and stuff

`npx react-native run-android`

To listen to the logs `adb logcat *:S ReactNative:V ReactNativeJS:V TRLogTag WritableMapHelper`
