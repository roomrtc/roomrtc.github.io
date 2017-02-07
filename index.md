---
layout: default
title: RoomRTC enables quick development of WebRTC
---

Create a new roomrtc application:

```js
var roomRTC = new RoomRTC();
roomRTC.on("connected", function (id) {
    console.log("connected connectionId: ", id);
});
```