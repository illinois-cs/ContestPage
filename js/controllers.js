contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {
      var ta;
      for (var i = 0; i < students.length; i++) {
          if (students[i].is_ta_solution) {
              ta = students[i];
              break;
          }
      }

      var getRating = function(student) {
          if(ta == undefined) {
            console.log("ta was undefined.")
          }
          if(student == undefined) {
            console.log("Student was undefined.")
          }
          if(student.test_cases == undefined) {
            console.log(student)
          }
          // for (var i = 0; i < student.test_cases.length; i++) {
          //     var testcase =  student.test_cases[i];
          //     if (testcase.pts_earned != testcase.total_pts) {
          //       return -1;
          //     }
          //     totalMaxMemory += Number(testcase.max_memory);
          //     totalAvgMemory += Number(testcase.avg_memory);
          //     totalRuntime += Number(testcase.runtime);
          // }
          // return .6 * Number(totalMaxMemory) + .2 * Number(totalAvgMemory) + .2 * Number(totalRuntime);
          // http://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
          function zip(arrays) {
              return arrays[0].map(function(_,i){
                  return arrays.map(function(array){return array[i]})
              });
          }

          student_ta_test_cases = zip([student.test_cases, ta.test_cases])
          stat = function(student_ta_test_case) {

              student_test_case = student_ta_test_case[0]
              ta_test_case = student_ta_test_case[1]
              if (student_test_case.pts_earned != student_test_case.total_pts) {
                return Infinity;
              }
              return .2 * (student_test_case.avg_memory / ta_test_case.avg_memory)
               + .2 * (student_test_case.runtime / ta_test_case.runtime)
               + .6 * (student_test_case.max_memory / ta_test_case.max_memory)
          }
          function add(a, b) {
              return a + b;
          }
          return 100 * student_ta_test_cases.map(stat).reduce(add, 0) / student.test_cases.length;
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

      $scope.getNormalizedRating = function(student) {
        // var taRating = ta != undefined ? getRating(ta) : 1;
        // Hack for now ...
        if(Object.keys(student).length < 2) return Infinity;
        var studentRating = getRating(student, ta);
        return studentRating == -1 ? Infinity : studentRating;
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
        $(".xscroll, .xscroll > div").width($(window).width() - 1.1 * $(".col1").width());
        $(".col1, #scrollTable").height(0.87*$(window).height());
      });
      $( window ).resize();
    });
  }]);
