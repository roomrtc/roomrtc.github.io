---
layout: page
title: Demo audio chat &middot; RoomRTC
---

<!-- load styles cdn -->
<link href="{{ site.baseurl }}/dist/style.css" rel="stylesheet" type="text/css" media="screen" />

{% raw %}
<div ng-app="audio" ng-controller="roomController">
    <h1 ng-if="!isConnected">Connecting to: <span ng-bind="room">demo</span>...</h1>
    <h1 ng-if="isConnected">You are in room: <span ng-bind="room">demo</span></h1>
    <audio class="mirror" oncontextmenu="return false;" width="300" height="200" ng-src="{{localAudio}}" autoplay="true"></audio>
    <div class="media-controls">
        <input type="button" value="Stop" ng-click="stop()">&nbsp;
        <input type="button" value="Start" ng-click="start()">
    </div>
    <div id="remotes">
        <div class="audio" ng-repeat="(id, remoteAudio) in remoteAudios">
            <audio id="{{id}}" oncontextmenu="return false;" ng-src="{{remoteAudio}}" autoplay="true"></audio>
        </div>
    </div>
    <p>Display list clients</p>
    <ul>
        <li ng-repeat="(id, client) in clients">{{ $index + 1 }}: [{{ id }},{{ client.name }}]</li>
    </ul>
</div>
{% endraw %}

<script src="{{ site.baseurl }}/dist/roomrtc.min.js"></script>
<script src="{{ site.baseurl }}/dist/angular-v1.4.9.js"></script>
<script src="{{ site.baseurl }}/assets/js/audio.js"></script>
