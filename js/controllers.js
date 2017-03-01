contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {
      // Find TA solution and fudge some values:
      var ta;
      for (var i = 0; i < students.length; i++) {
          if(students[i].is_ta_solution) {
            ta = students[i];
            ta["nickname"] = "glibc";
            ta["test_cases"][0]["max_memory"] += 32.;
            ta["test_cases"][0]["avg_memory"] += 32.;
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
                return -Infinity;
              }
              var ta_run = ta_test_case.runtime + 1e-6;
              var st_run = student_test_case.runtime > 0 ? (student_test_case.runtime + 1e-6) : Infinity;
              var ta_avg = ta_test_case.avg_memory + 1e3;
              var st_avg = student_test_case.avg_memory > 0 ? (student_test_case.avg_memory + 1e3) : Infinity;
              var ta_max = ta_test_case.max_memory + 1e3;
              var st_max = student_test_case.max_memory > 0 ? (student_test_case.max_memory + 1e3) : Infinity;
              return (
                Math.log2(ta_run / st_run + 1) +
                Math.log2(ta_avg / st_avg + 1) +
                Math.log2(ta_max / st_max + 1));
          }
          function add(a, b) {
              return a + b;
          }
          return 100 * student_ta_test_cases.map(stat).reduce(add, 0) /
	         (3 * student.test_cases.length);
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
              unit = "us";
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
        if(Object.keys(student).length < 2) return 0;
        var studentRating = getRating(student, ta);
        return studentRating <= 0 ? 0 : -studentRating;
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
        $(".xscroll, .xscroll > div").width($(window).width() - $(".col1").width());
        $(".col1, #scrollTable").height($(window).height() - $("#headers").height());
      });
      $( window ).resize();
    });
  }]);
