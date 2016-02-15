//Data
var cities = [
    {
        city : 'Toronto',
        desc : 'This is the best city in the world!',
        ipaddress : '192.168.0.1',
        hostname: 'ip1',
        asn:  'asn1',
        lat : 43.7000,
        long : -79.4000
    },
    {
        city : 'New York',
        desc : 'This city is aiiiiite!',
        ipaddress : '192.168.0.1',
        hostname: 'ip1',
        asn:  'asn1',
        lat : 40.6700,
        long : -73.9400
    },
    {
        city : 'Chicago',
        desc : 'This is the second best city in the world!',
        ipaddress : '192.168.0.1',
        hostname: 'ip1',
        asn:  'asn1',       
        lat : 41.8819,
        long : -87.6278
    },
    {
        city : 'Los Angeles',
        desc : 'This city is live!',
        ipaddress : '192.168.0.1',
        hostname: 'ip1',
        asn:  'asn1',        
        lat : 34.0500,
        long : -118.2500
    },
    {
        city : 'Las Vegas',
        desc : 'Sin City...\'nuff said!',
        ipaddress : '192.168.0.1',
        hostname: 'ip1',
        asn:  'asn1',        
        lat : 36.0800,
        long : -115.1522
    }
];

//Angular App Module and Controller
var app = angular.module('mapsApp', []);

app.controller('MapCtrl', function ($scope) {

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.desc = '<div class="infoWindowContent">' + info.desc + '</div>';
        marker.ipaddress = '<div class="infoWindowContent">' + info.ipaddress + '</div>';
        marker.hostname = '<div class="infoWindowContent">' + info.hostname + '</div>'; 
        marker.asn = '<div class="infoWindowContent">' + info.asn + '</div>';         

        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.desc + marker.ipaddress + marker.hostname + marker.asn);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);        
    }  
    
    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

});


