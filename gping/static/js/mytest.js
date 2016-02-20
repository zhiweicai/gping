//Angular App Module and Controller
var app = angular.module('mapsApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
});

app.controller('MapCtrl', function ($scope,$http) {

    $scope.text = '';
    var mylat = document.getElementById('mylat').innerText;
    var mylong = document.getElementById('mylong').innerText;
    console.log (mylat);
    console.log (mylong);

    $scope.init = function(mylat, mylong)
    {
        //This function is sort of private constructor for controller
        $scope.mylat = parseFloat (mylat);
        $scope.mylong = parseFloat (mylong);
        console.log ($scope.mylat);
        console.log ($scope.mylong);
    };


    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(mylat,mylong),
        mapTypeId: google.maps.MapTypeId.HYBRID
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.loc_lat, info.loc_long),
            title: info.ipaddress
        });
        marker.ipaddress = '<div class="infoWindowContent">' + info.ipaddress + '</div>';
        marker.hostname = '<div class="infoWindowContent">' + info.hostname + '</div>'; 
        marker.asn = '<div class="infoWindowContent">' + info.asn + '</div>';         

        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.ipaddress + '</h2>' +  marker.hostname + marker.asn);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  
    

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }


    $scope.submit = function () {

        var retrycount = 0;

        function successCallback (response) {
            console.log (response.data);
            $http.get('getresult').then(resultCallback, errorCallback);
        }

        function resultCallback (response) {
            console.log (response.data);
            if (response.data.length  == 0)
            {
                retrycount ++;
                if (retrycount <=20)
                    setTimeout(function(){ $http.get('getresult').then(resultCallback, errorCallback); }, 500);
            }
            else
            {
                var result = angular.fromJson(response.data);
                createMarker(result);
                if (!result.last)
                    $http.get('getresult').then(resultCallback, errorCallback);
            }
        }

        function errorCallback (response) {
            console.log ("error");
        }

        var data = 
        {
            address: $scope.text
        };

        var config = 
        {
            params: data
        };

        $http.get('ping',config).then(successCallback, errorCallback);
    }

});