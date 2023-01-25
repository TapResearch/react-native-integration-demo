# TapResearch React Native Integration Demo

## Build
* Create a new react native App
* Make sure the project is a native project [link](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md)
* Import the TapResearch React Native SDK
~~~
npm i react-native-tapresearch -S
react-native link react-native-tapresearch # only if you are using react-native < 0.60 
~~~
* Pull / Download the repo and copy the files to the new project
* `cp .env.developnment .env`, then
* Grab your app api token from the [Supplier Dashboard](https://www.tapresearch.com/supplier_dashboard/overview) and replace the `API_TOKEN` variable in `.env`
* In  build.gradle of your android app add the following lines (see [here for example](https://github.com/TapResearch/react-native-integration-demo/blob/master/android/build.gradle))
```
maven { url "https://artifactory.tools.tapresearch.io/artifactory/tapresearch-android-sdk/" }`
```
* In the command line execute `react-native run-android` / `react-native run-ios`

[TapResearch React Native SDK integration guide](https://www.tapresearch.com/docs/react-native-integration-guide).
