angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $http) {
    $scope.time = {};
    $scope.time.elapsed = 0;
    var timer;

    $scope.start = function () {
      $scope.started = true;
      $scope.stoped = false;
      timer = setInterval(function () {
        $scope.time.elapsed++;
        $scope.$apply();
      }, 1000);
    };

    $scope.stop = function () {
      clearInterval(timer);
      $scope.stoped = true;
      $scope.started = false;
    };

    $scope.reset = function(){
      $scope.time.elapsed = 0;
    };

    $scope.send = function () {
      var first = localStorage.getItem('first');
      var last = localStorage.getItem('last');
      var time = $scope.time.elapsed;
      var storedId = localStorage.getItem('id');

      $http.get('http://webcampdarmstadt.azurewebsites.net/api/drivers/' + storedId)
        .then(function (response) {
          if (response.data.routes) {
            $scope.routes = response.data.routes;
          }
          if ($scope.routes && $scope.routes.length > 0) {
            $scope.routes.push({
              first: first,
              last: last,
              time: time
            });
          } else {
            $scope.routes = [{
              first:first,
                last:last,
              time:time}];
          }
          $http.put('http://webcampdarmstadt.azurewebsites.net/api/drivers/' + storedId, { routes: $scope.routes});
        });
    };
  })

  .controller('AccountCtrl', function ($scope, $http) {
    $scope.user = {};
    $scope.user.id = localStorage.getItem('id');
    $http.get('http://webcampdarmstadt.azurewebsites.net/api/drivers/' + $scope.user.id)
      .then(function (response) {
        $scope.user.firstName = response.data.firstName;
        $scope.user.lastName = response.data.lastName;
      });

    $scope.save = function () {
      localStorage.setItem('first', $scope.user.firstName);
      localStorage.setItem('last', $scope.user.lastName);
      localStorage.setItem('id', $scope.user.id);
    };
  });
