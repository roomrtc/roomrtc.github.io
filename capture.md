---
layout: page
title: Capture Photos from Camera &middot; RoomRTC
---

<!-- load styles cdn -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" type="text/css" media="screen" />
<link href="{{ site.baseurl }}/assets/css/capture.css" rel="stylesheet" type="text/css" media="screen" />

<!-- load app scripts -->
<script src="{{ site.baseurl }}/dist/roomrtc.min.js"></script>
<script src="{{ site.baseurl }}/assets/js/capture.js"></script>

<div class="contentarea">
    <p>
        This example demonstrates how to set up a media stream using your built-in webcam, fetch an image from that stream, and create a PNG using that image.
    </p>
    <div class="camera">
        <video id="video">Video stream not available.</video>
        <button id="startbutton">Take photo</button>
    </div>
    <canvas id="canvas"></canvas>
    <div class="output">
        <img id="photo" alt="The screen capture will appear in this box.">
    </div>
</div>
