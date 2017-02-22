---
layout: default
title: RoomRTC enables quick development of WebRTC
---

## Creating a new roomrtc application is easy and then you can send `video`, `audio`, `message` and `data` in realtime.

Here is the list of demos you can do with roomrtc:

* [Video chat](/demo?room43)
* [Audio chat](/demo?room44)
* [File transfer](/filetransfer?room45)
* [Capture Photos from Camera](/capture)
* And more ...

# 3 easy steps to build

## 1. Include the library

```html
<script src="https://roomrtc.github.io/dist/roomrtc.min.js"></script> 
```

## 2. Create application object

```js
var roomrtc = new RoomRTC();
var remotesVideos = {};

roomrtc.initMediaSource().then(stream => {
    var streamUrl = roomrtc.getStreamAsUrl(stream);
    // Show local stream in some video/canvas element.
}).catch(err => {
    console.error('Failed to get local stream', err);
});

roomrtc.on('videoAdded', function(pc, stream) {
    var pid = pc.id;
    var streamUrl = roomrtc.getStreamAsUrl(stream);
    console.log('Ohh, we have a new participant', pid);
    remotesVideos[pid] = streamUrl;
    // Show remote stream in some video/canvas element.
});

roomrtc.on('videoRemoved', function(pc) {
    var pid = pc.id;
    var url = remoteVideos[pid];
    roomrtc.revokeObjectURL(url);
    console.log('Ohh, a participant has gone', pid);
    delete remotesVideos[url];
}
```

## 3. Ready to join room

```js
var room = 'demo';
roomrtc.on('readyToCall', function (id) {
    roomrtc.joinRoom(room)
        .then(roomData => {
            console.log('joinRoom ok: ', roomData);
            return roomData.clients;
        })
        .catch(err => {
            console.error('joinRoom error: ', err);
        });
});
```
