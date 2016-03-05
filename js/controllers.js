contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var getRating = function(student) {
          var totalMaxMemory = 0;
          var totalAvgMemory = 0;
          var totalRuntime = 0;
          if(student == undefined) {
            console.log("HWOAOOA")
          }
          if(student.test_cases == undefined) {
            console.log(student)
          }
          for (var i = 0; i < student.test_cases.length; i++) {
              var testcase =  student.test_cases[i];
              if (testcase.pts_earned != testcase.total_pts) {
                return -1;
              }
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
      $scope.formatMem = function(t) {
          var unit = "B";
          var b = 1024;
          if (t > b) {
              t /= b;
              unit = "KB";
              if (t > b) {
                  t /= b;
                  unit = "MB";
                  if (t > b) {
                      t /= b;
                      unit = "GB";
                  }
              }
              t = t.toFixed(2);
          }
          return [t, unit];
      };
      $scope.formatTime = function(t) {
          t *= 1e9;
          var unit = "ns";
          if (t > 1000) {
              t /= 1000;
              unit = "Î¼s";
              if (t > 1000) {
                  t /= 1000;
                  unit = "ms";
                  if (t > 1000) {
                      t /= 1000;
                      unit = "s";
                  }
              }
              t = t.toFixed(2);
          }
          return [t,unit];
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
        // Hack for now ...
        if(Object.keys(student).length < 2) return Infinity;
        var studentRating = getRating(student);
        return studentRating == -1 ? Infinity : (studentRating / taRating) * 100;
      }

      // Keeps all the tables in sync
      $('#scrollTable').scroll(function(){
        var a = $("#scrollTable").scrollTop();
        var b = $("#scrollTable").scrollLeft();
        $(".col1").scrollTop(a);
        $("#headers").scrollLeft(b);
      });

      // Resize things
      $( window ).resize(function() {
        $(".xscroll, .xscroll > div").width($(window).width() - 1.07 * $(".col1").width());
        $(".col1, #scrollTable").height(0.90*$(window).height());
      });
      $( window ).resize();


    });
  }]);
