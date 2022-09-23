import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, PermissionsAndroid, Text } from 'react-native';
import {
  LiveStreamMethods,
  LiveStreamView,
} from '@api.video/react-native-livestream';

const App = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const ref = useRef<LiveStreamMethods>(null);
  const [streaming, setStreaming] = useState(false);
  const [visible, setVisible] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        setHasPermissions(true);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      {hasPermissions && visible && (
        <LiveStreamView
          style={{
            flex: 1,
            backgroundColor: 'black',
            alignSelf: 'stretch',
            height: 500,
          }}
          ref={ref}
          camera="back"
          video={{
            fps: 30,
            resolution: '720p',
            bitrate: 1 * 1024 * 1024, // # 2 Mbps
          }}
          enablePinchedZoom
          audio={{
            bitrate: 128000,
            sampleRate: 44100,
            isStereo: true,
          }}
          onConnectionSuccess={() => {
            //do what you want
          }}
          onConnectionFailed={e => {
            //do what you want
          }}
          onDisconnect={() => {
            //do what you want
          }}
        />
      )}
      <View style={{ position: 'absolute', bottom: 40 }}>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: streaming ? 'red' : 'white',
            width: 50,
            height: 50,
          }}
          onPress={() => {
            if (streaming) {
              ref.current?.stopStreaming();
              setStreaming(false);
            } else {
              ref.current?.startStreaming('STREAM_KEY');
              setStreaming(true);
            }
          }}
        />
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: visible ? 'blue' : 'green',
            width: 50,
            height: 50,
            marginLeft: 100,
          }}
          onPress={() => {
            setVisible(v => !v);
          }}
        />
      </View>
    </View>
  );
};

export default App;
