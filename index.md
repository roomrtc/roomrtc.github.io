---
layout: default
title: RoomRTC enables quick development of WebRTC
---

Checkout page: [Demo](/demo)

Create a new roomrtc application:

```js
var roomRTC = new RoomRTC();
roomRTC.on("connected", function (id) {
    console.log("connected connectionId: ", id);
});
```