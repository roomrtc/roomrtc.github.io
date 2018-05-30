---
layout: page
title: Demo video chat &middot; RoomRTC
---

<!-- load styles cdn -->
<link href="{{ site.baseurl }}/latest/style.css" rel="stylesheet" type="text/css" media="screen" />

{% raw %}
<div ng-app="demo" ng-controller="roomController">
    <h1 ng-if="!isConnected">Connecting to: <span ng-bind="room">demo</span>...</h1>
    <h1 ng-if="isConnected">You are in room: <span ng-bind="room">demo</span></h1>
    <video class="mirror" width="300" height="200" ng-src="{{localVideo}}" autoplay="true"></video>
    <div class="media-controls">
        <input type="button" value="Stop" ng-click="stop()">&nbsp;
        <input type="button" value="Start" ng-click="start()">
    </div>
    <div id="remotes">
        <div class="video" ng-repeat="(id, remoteVideo) in remoteVideos">
            <video id="{{id}}" ng-src="{{remoteVideo}}" autoplay="true"></video>
        </div>
    </div>
    <p>Display list clients</p>
    <ul>
        <li ng-repeat="(id, client) in clients">{{ $index + 1 }}: [{{ id }},{{ client.name }}]</li>
    </ul>
</div>
{% endraw %}

<script src="{{ site.baseurl }}/latest/roomrtc.bundle.js"></script>
<script src="{{ site.baseurl }}/latest/angular-v1.4.9.js"></script>
<script type="text/javascript">
    angular.module("demo", [])
        .controller("roomController", function ($scope, $timeout, $sce) {
            $scope.localVideo = null;
            $scope.remoteVideos = {};
            $scope.isConnected = false;

            var room = $scope.room = (location.search && location.search.split('?')[1]) || "demo";
            var roomrtc = new RoomRTC();

            roomrtc.initMediaSource()
                .then(stream => {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                })
                .catch(err => {
                    console.error('Failed to get local stream', err);
                });

            roomrtc.on("connected", function (id) {
                console.log("connected connectionId: ", id);
            });

            roomrtc.on("readyToCall", function (id) {
                console.log("readyToCall, connectionId: ", id);
                roomrtc.joinRoom(room)
                    .then(roomData => {
                        console.log("joinRoom ok: ", roomData);
                        $timeout(function () {
                            $scope.isConnected = true;
                            $scope.clients = roomData.clients;
                        });
                        return roomData.clients;
                    })
                    .catch(err => {
                        console.error("joinRoom error: ", err);
                    });
            });

            roomrtc.on("videoAdded", function(pc, stream) {
                var pid = pc.id;
                console.log("Ohh, we have a new participant", pid);
                $timeout(function() {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    var trustUrl = $sce.trustAsResourceUrl(streamUrl);
                    $scope.remoteVideos[pid] = trustUrl;
                    $scope.clients[pid] = pc.resources;
                })
            });

            roomrtc.on("videoRemoved", function(pc) {
                var pid = pc.id;
                var url = $scope.remoteVideos[pid];
                roomrtc.revokeObjectURL(url);
                console.log("Ohh, a participant has gone", pid);
                $timeout(function() {
                    // remove url from remoteVideos
                    delete $scope.remoteVideos[pid];
                    delete $scope.clients[pid];
                })
            });

            /**
                * Setup control buttons
                * */
            $scope.stop = function () {
                $scope.localVideo = null;
                roomrtc.stop();
            }

            $scope.start = function () {
                roomrtc.initMediaSource().then(stream => {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });
            }
        });
</script>
