---
layout: page
title: RoomRTC Demo
---

<!-- load styles cdn -->
<link href="{{ site.baseurl }}/dist/style.css" rel="stylesheet" type="text/css" media="screen" />

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

<script src="{{ site.baseurl }}/dist/roomrtc.min.js"></script>
<script src="{{ site.baseurl }}/dist/angular-v1.4.9.js"></script>
<script type="text/javascript">
    angular.module("demo", [])
        .controller("roomController", function ($scope, $timeout, $sce) {
            $scope.localVideo = null;
            $scope.remoteVideos = {};
            $scope.isConnected = false;

            var room = $scope.room = (location.search && location.search.split('?')[1]) || "demo";
            var roomRTC = new RoomRTC();

            roomRTC.initMediaSource()
                .then(stream => {
                    var streamUrl = roomRTC.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });

            roomRTC.on("connected", function (id) {
                console.log("connected connectionId: ", id);
            });

            roomRTC.on("readyToCall", function (id) {
                console.log("readyToCall, connectionId: ", id);
                roomRTC.joinRoom(room)
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

            roomRTC.on("videoAdded", function(pc, stream) {
                var pid = pc.id;
                console.log("Ohh, we have a new participant", pid);
                $timeout(function() {
                    var streamUrl = roomRTC.getStreamAsUrl(stream);
                    var trustUrl = $sce.trustAsResourceUrl(streamUrl);
                    $scope.remoteVideos[pid] = trustUrl;
                    $scope.clients[pid] = pc.resources;
                })
            });

            roomRTC.on("videoRemoved", function(pc) {
                var pid = pc.id;
                var url = $scope.remoteVideos[pid];
                roomRTC.revokeObjectURL(url);
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
                roomRTC.stop();
            }

            $scope.start = function () {
                roomRTC.initMediaSource().then(stream => {
                    var streamUrl = roomRTC.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });
            }
        });
</script>
