contestApp.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(data) {
      $scope.students = data;
    });

    $scope.options = [
      { label: 'Nickname', value: 'nickname' },
      { label: 'Points', value: 'total_pts_earned' },
      { label: 'Time', value: 'total_time' },
      { label: 'Max Memory', value: 'total_max_memory' },
      { label: 'Average Memory', value: 'total_avg_memory' }
    ];

    $scope.filterOpts = $scope.options[0];
  }]);
