angular.module("audio", []).controller("roomController", function ($scope, $timeout, $sce) {
    $scope.localAudio = null;
    $scope.remoteAudios = {};
    $scope.isConnected = false;

    var room = $scope.room = (location.search && location.search.split('?')[1]) || "demo";
    var roomrtc = new RoomRTC({
        media: {
            audio: true,
            video: false
        },
        receiveMedia: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 0
        }
    });

    function setlocalAudio(streamUrl) {
        $scope.localAudio = $sce.trustAsResourceUrl(streamUrl);
    }

    roomrtc.initMediaSource({
            audio: true,
            video: false
        })
        .then(stream => {
            var streamUrl = roomrtc.getStreamAsUrl(stream);
            $timeout(setlocalAudio.bind($scope, streamUrl));
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

    roomrtc.on("videoAdded", function (pc, stream) {
        var pid = pc.id;
        console.log("Ohh, we have a new participant", pid);
        $timeout(function () {
            var streamUrl = roomrtc.getStreamAsUrl(stream);
            var trustUrl = $sce.trustAsResourceUrl(streamUrl);
            $scope.remoteAudios[pid] = trustUrl;
            $scope.clients[pid] = pc.resources;
        })
    });

    roomrtc.on("videoRemoved", function (pc) {
        var pid = pc.id;
        var url = $scope.remoteAudios[pid];
        roomrtc.revokeObjectURL(url);
        console.log("Ohh, a participant has gone", pid);
        $timeout(function () {
            // remove url from remoteAudios
            delete $scope.remoteAudios[pid];
            delete $scope.clients[pid];
        })
    });

    /**
     * Setup control buttons
     * */
    $scope.stop = function () {
        $scope.localAudio = null;
        roomrtc.stop();
    }

    $scope.start = function () {
        roomrtc.initMediaSource().then(stream => {
            var streamUrl = roomrtc.getStreamAsUrl(stream);
            $timeout(setlocalAudio.bind($scope, streamUrl));
        });
    }
});