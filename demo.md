---
layout: page
title: RoomRTC Demo
---

<!-- load styles cdn -->
<link href="{{ site.baseurl }}/dist/style.css" rel="stylesheet" type="text/css" media="screen" />

<div ng-app="demo" ng-controller="roomController">
    <h1>You are in room: <span ng-bind="room">...</span></h1>
    {% raw %}
    <video class="mirror" width="300" height="200" ng-src="{{localVideo}}" autoplay="true"></video>
    {% endraw %}
    <div class="media-controls">
        <input type="button" value="Stop" ng-click="stop()">&nbsp;
        <input type="button" value="Start" ng-click="start()">
    </div>
    <div id="remotes">
        <div class="video" ng-repeat="remoteVideo in remoteVideos">
            {% raw %}
            <video ng-src="{{remoteVideo}}" autoplay="true"></video>
            {% raw %}
        </div>
    </div>
    <p>Display list clients</p>
    <ul>
        <li ng-repeat="(id, client) in clients">{{ $index + 1 }}: [{{ id }},{{ client.name }}]</li>
    </ul>
</div>

<script src="{{ site.baseurl }}/dist/roomrtc.latest.js"></script>
<script src="{{ site.baseurl }}/dist/angular-v1.4.9.js"></script>
<script type="text/javascript">
    angular.module("demo", [])
        .controller("roomController", function ($scope, $timeout, $sce) {
            $scope.localVideo = null;
            $scope.remoteVideos = [];

            var room = $scope.room = (location.search && location.search.split('?')[1]) || "demo";
            var roomRTC = new RoomRTC();
            roomRTC.on("connected", function (id) {
                console.log("connected connectionId: ", id);
            });
            roomRTC.on("readyToCall", function (id) {
                console.log("readyToCall, connectionId: ", id);
                roomRTC.initMediaSource()
                    .then(stream => {
                        var streamUrl = roomRTC.getStreamAsUrl(stream);
                        $timeout(function () {
                            $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                        });
                        return roomRTC.joinRoom(room);
                    })
                    .then(roomData => {
                        console.log("joinRoom ok: ", roomData);
                        $timeout(function () {
                            $scope.clients = roomData.clients;
                        });
                        return roomData.clients;
                    })
                    .catch(err => {
                        console.error("joinRoom error: ", err);
                    });
            });

            roomRTC.on("videoAdded", function(stream, pc) {
                console.log("Ohh, we have a new participant", pc.id);
                $timeout(function() {
                    var streamUrl = roomRTC.getStreamAsUrl(stream);
                    var trustUrl = $sce.trustAsResourceUrl(streamUrl);
                    $scope.remoteVideos.push(trustUrl);
                })
            });

            /**
                * Setup control buttons
                * */
            $scope.stop = function () {
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
