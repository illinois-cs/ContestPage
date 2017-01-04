contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {
      // Hard coding TA statistics to stop students from bleeding too hard
      var ta = {
          "total_time": 33.517323999999995,
          "test_cases": [
            {
              "avg_memory": 1000000.0,
              "total_pts": 1.0,
              "name": "part2_tester-1",
              "max_memory": 1000000.0,
              "pts_earned": 1.0,
              "runtime": 5.988813
            },
            {
              "avg_memory": 167724872.411363,
              "total_pts": 1.0,
              "name": "part2_tester-2",
              "max_memory": 209686528.0,
              "pts_earned": 1.0,
              "runtime": 3.73751
            },
            {
              "avg_memory": 1048401.266456,
              "total_pts": 1.0,
              "name": "part2_tester-3",
              "max_memory": 1048576.0,
              "pts_earned": 1.0,
              "runtime": 2.031576
            },
            {
              "avg_memory": 397814286.35719,
              "total_pts": 1.0,
              "name": "part2_tester-4",
              "max_memory": 1073741824.0,
              "pts_earned": 1.0,
              "runtime": 1.519419
            },
            {
              "avg_memory": 262339907.839119,
              "total_pts": 1.0,
              "name": "part2_tester-5",
              "max_memory": 518926336.0,
              "pts_earned": 1.0,
              "runtime": 0.604985
            },
            {
              "avg_memory": 790393287.111111,
              "total_pts": 1.0,
              "name": "part2_tester-6",
              "max_memory": 1789571072.0,
              "pts_earned": 1.0,
              "runtime": 8.847705
            },
            {
              "avg_memory": 447391744.0,
              "total_pts": 1.0,
              "name": "part2_tester-7",
              "max_memory": 1073741824.0,
              "pts_earned": 1.0,
              "runtime": 3.639624
            },
            {
              "avg_memory": 853773568.0,
              "total_pts": 1.0,
              "name": "part2_tester-8",
              "max_memory": 2028179456.0,
              "pts_earned": 1.0,
              "runtime": 4.956268
            },
            {
              "avg_memory": 348122438.176778,
              "total_pts": 1.0,
              "name": "part2_tester-9",
              "max_memory": 655773696.0,
              "pts_earned": 1.0,
              "runtime": 0.292566
            },
            {
              "avg_memory": 167833995.785251,
              "total_pts": 1.0,
              "name": "part2_tester-10",
              "max_memory": 268636160.0,
              "pts_earned": 1.0,
              "runtime": 1.639981
            },
            {
              "avg_memory": 1207929353.766156,
              "total_pts": 1.0,
              "name": "part2_tester-11",
              "max_memory": 2147483648.0,
              "pts_earned": 1.0,
              "runtime": 0.258877
            }
          ],
          "is_ta_solution": true,
          "last_revision": "40795",
          "total_pts_earned": 11.0,
          "total_max_memory": 9766789120.0,
          "time_stamp": "2016-03-05 13:05:38.873592",
          "nickname": "glibc",
          "total_avg_memory": 4644371854.713424
        }

      // Swapping out ta with hardcoding:
      for (var i = 0; i < students.length; i++) {
          if(students[i].is_ta_solution) {
            students[i] = ta;
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
