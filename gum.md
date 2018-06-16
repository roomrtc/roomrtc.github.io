---
layout: page
title: getUserMedia constraints &middot; RoomRTC
---

<!-- load styles cdn -->
<link href="{{ site.baseurl }}/latest/style.css" rel="stylesheet" type="text/css" media="screen" />

{% raw %}
<style>
video {
	background: none;
	height: auto;
	width: auto;
}
</style>
<div ng-app="demo" ng-controller="roomController">
    <div class="media-controls">
        <input type="button" value="Stop" ng-click="stop()">&nbsp;
        <input type="button" value="QVGA" ng-click="qvga()">
        <input type="button" value="VGA" ng-click="vga()">
        <input type="button" value="HD" ng-click="hd()">
    </div>
    <p bind="dimensions"></p>
    <video class="mirror" ng-src="{{localVideo}}" autoplay="true"></video>
</div>
{% endraw %}

<script src="{{ site.baseurl }}/latest/roomrtc.min.js"></script>
<script src="{{ site.baseurl }}/latest/angular-v1.4.9.js"></script>
<script type="text/javascript">
    angular.module("demo", [])
        .controller("roomController", function ($scope, $timeout, $sce) {
            $scope.localVideo = null;
            var qvgaConstraints = {
                video: {
                    mandatory: {
                        maxWidth: 320,
                        maxHeight: 180
                    }
                }
            };

            var vgaConstraints = {
                video: {
                    mandatory: {
                        maxWidth: 640,
                        maxHeight: 360
                    }
                }
            };

            var hdConstraints = {
                video: {
                    mandatory: {
                        minWidth: 1280,
                        minHeight: 720
                    }
                }
            };

            var roomrtc = new RoomRTC();
            var video = document.querySelector('video');

            video.addEventListener('play', function() {
                $timeout(function() {
                    $scope.dimensions = 'Actual video dimensions: ' + video.videoWidth +
    'x' + video.videoHeight + 'px.';
                }, 500);
            });

            /**
                * Setup control buttons
                * */
            $scope.stop = function () {
                $scope.localVideo = null;
                roomrtc.stop();
            }

            $scope.qvga = function () {
                $scope.stop();
                roomrtc.initMediaSource(qvgaConstraints).then(stream => {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });
            }

            $scope.vga = function () {
                $scope.stop();
                roomrtc.initMediaSource(vgaConstraints).then(stream => {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });
            }

            $scope.hd = function () {
                $scope.stop();
                roomrtc.initMediaSource(hdConstraints).then(stream => {
                    var streamUrl = roomrtc.getStreamAsUrl(stream);
                    $timeout(function () {
                        $scope.localVideo = $sce.trustAsResourceUrl(streamUrl);
                    });
                });
            }
        });
</script>
