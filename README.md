# TapResearch React Native Integration Demo

## Build
* Create a new react native App
* Make sure the project is a native project [link](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md)
* Import the TapResearch React Native SDK
~~~
npm i react-native-tapresearch -S
react-native link react-native-tapresearch
~~~
* Pull / Download the repo and copy the files to the new project
* Grab your app api token from the [Supplier Dashboard](https://www.tapresearch.com/supplier_dashboard/overview) and replace the `API_TOKEN` variable in `App.js`
* Grab a placement identifier from the [Supplier Dashboard](https://www.tapresearch.com/supplier_dashboard/overview) and replace the `PLACEMENT_IDENTIFIER` variable in `App.js`
* In  build.gradle of your app add `maven { url "https://artifactory.tools.tapresearch.io/artifactory/tapresearch-android-sdk/" }` in the allprojects/repositories section

* In the command line execute `react-native run-android` / `react-native run-ios`

[TapResearch React Native SDK integration guide](https://www.tapresearch.com/docs/react-native-integration-guide).
