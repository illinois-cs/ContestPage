contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
  $http.get('./data/results.json').success(function(students) {

    // Figure out what grading formula we're using
    // https://css-tricks.com/snippets/javascript/get-url-variables/
    function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    }
    var formula = getQueryVariable("formula");

    // Find TA solution
    var ta;
    for (var i = 0; i < students.length; i++) {
      if (students[i].is_ta_solution) {
        ta = students[i];
        ta["nickname"] = "glibc";
        // Fudge memory usage for the first test so it doesn't show as 0 bytes
        ta["test_cases"][0].max_memory += 32.;
        ta["test_cases"][0].avg_memory += 32.;

        // TODO: runtimes are currently incorrect and need to be updated...
        // hardcode for now
        ta["test_cases"][1  -1].runtime =  0.372000;
        ta["test_cases"][2  -1].runtime =  0.392000;
        ta["test_cases"][3  -1].runtime =  1.220000;
        ta["test_cases"][4  -1].runtime =  0.456000;
        ta["test_cases"][5  -1].runtime =  0.196000;
        ta["test_cases"][6  -1].runtime =  8.128000;
        ta["test_cases"][7  -1].runtime =  3.272000;
        ta["test_cases"][8  -1].runtime =  4.528000;
        ta["test_cases"][9  -1].runtime =  0.100000;
        ta["test_cases"][10 -1].runtime = 11.216000;
        ta["test_cases"][11 -1].runtime =  0.192000;
        ta["test_cases"][12 -1].runtime =  7.644000;

        if (formula == "fast") {
          ta["test_cases"][10 -1].runtime =  0.048000;
        }

        break;
      }
    }

    var getRating = function(student) {
      if (ta == undefined) {
        console.log("ta was undefined.")
        return -Infinity;
      }
      if (student == undefined) {
          console.log("Student was undefined.")
          return -Infinity;
      }
      if (student.test_cases == undefined) {
          console.log(student)
          return -Infinity;
      }

      if (formula == "old") {
        var stMax = 0, stAvg = 0, stRun = 0;
        var taMax = 0, taAvg = 0, taRun = 0;
        for (var i = 0; i < ta.test_cases.length; i++) {
          var stTest = student.test_cases[i];
          if (stTest.pts_earned != stTest.total_pts) {
            stMax += -1e15;
            stAvg += -1e15;
            stRun += -1e15;
          } else {
            stMax += stTest.max_memory;
            stAvg += stTest.avg_memory;
            stRun += stTest.runtime;
          }

          var taTest = ta.test_cases[i];
          taMax += taTest.max_memory;
          taAvg += taTest.avg_memory;
          taRun += taTest.runtime;
        }
        return 100 * (.6 * (taMax / stMax) + .2 * (taAvg / stAvg) + .2 * (taRun / stRun));
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
          // Like -Infinity, but not quite, so we can still kinda rank bad implementations
          return -1e15;
        }
        var runtime_fudge = 0.04;  // 40ms
        var memory_fudge = 1024;  // 1KB
        var ta_run = ta_test_case.runtime + runtime_fudge;
        var st_run = student_test_case.runtime > 0 ?
            (student_test_case.runtime + runtime_fudge) : Infinity;
        var ta_avg = ta_test_case.avg_memory + memory_fudge;
        var st_avg = student_test_case.avg_memory > 0 ?
            (student_test_case.avg_memory + memory_fudge) : Infinity;
        var ta_max = ta_test_case.max_memory + memory_fudge;
        var st_max = student_test_case.max_memory > 0 ?
            (student_test_case.max_memory + memory_fudge) : Infinity;
        return (
          (1/4) * Math.log2(ta_run / st_run + 1) +
          (3/8) * Math.log2(ta_avg / st_avg + 1) +
          (3/8) * Math.log2(ta_max / st_max + 1));
      }

      function add(a, b) { return a + b; }
      return 100 * student_ta_test_cases.map(stat).reduce(add, 0) /
          student.test_cases.length;
    }

    $scope.students = students;

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

    $scope.stripTimestamp = function(stamp) {
      return stamp.split(".")[0];
    };

    $scope.getPlaceText = function(index) {
      if (index == 1) return "1st";
      if (index == 2) return "2nd";
      if (index == 3) return "3rd";
      return "";
    }

    // Set ratings
    $.each(students, function(i, student) {
      if (Object.keys(student).length < 2) {
        student.normalizedRating = 0;
        student.sortOrder = Infinity;
        student.isPassing = false;
      } else {
        var rating = getRating(student, ta);
        student.normalizedRating = rating <= 0 ? 0 : rating;
        student.sortOrder = -rating;
        student.isPassing = rating > 0;
      }
    });

    // Keeps all the tables in sync
    $('#scrollTable').scroll(function() {
      var a = $("#scrollTable").scrollTop();
      var b = $("#scrollTable").scrollLeft();
      $(".col1").scrollTop(a);
      $("#headers").scrollLeft(b);
    });

    $("#loading-info").remove();

    // Resize things
    var col1_width = $("#col1-header").width();
    var head_height = $("#headers").height();
    $(".col1 table").width(col1_width);
    $(window).resize(function() {
      $(".xscroll, .xscroll > div").width($(window).width() - col1_width);
      $(".col1, #scrollTable").height($(window).height() - head_height);
    });
    $(window).resize();
  });
}]);
