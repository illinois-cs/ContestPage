contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var getRating = function(student) {
          var totalMaxMemory = 0;
          var totalAvgMemory = 0;
          var totalRuntime = 0;
          for (var i = 0; i < student.test_cases.length; i++) {
              var testcase =  student.test_cases[i];
              totalMaxMemory += Number(testcase.max_memory);
              totalAvgMemory += Number(testcase.avg_memory);
              totalRuntime += Number(testcase.runtime);
          }
          return .6 * Number(totalMaxMemory) + .2 * Number(totalAvgMemory) + .2 * Number(totalRuntime);
      }
      $scope.students = students;

      $scope.cleanse = function (unsafe) {
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;")
         .substring(0,15);
      };

      var ta;
      for (var i = 0; i < students.length; i++) {
          if (students[i].is_ta_solution) {
              ta = students[i];
              break;
          }
      }
      var taRating = ta != undefined ? getRating(ta) : 1;
      $scope.getNormalizedRating = function(student) {
        return (getRating(student) / taRating * 100).toFixed(2);
      }
    });
  }]);
