contestApp.controller('ContestCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var getRating = function(totalMaxMemory, totalAvgMemory, totalRuntime) {
          return .6 * Number(totalMaxMemory) + .2 * Number(totalAvgMemory) + .2 * Number(totalRuntime);
      }

      $scope.students = students;

      // Finding TA soln
      var ta;
      for (var i = 0; i < students.length; i++) {
          var student = students[i];
          if (student.is_ta_solution) {
              ta = student;
              break;
          }
      }
      if (ta != undefined) {
        var taTotalMaxMemory = 0;
        var taTotalAvgMemory = 0;
        var taTotalRuntime = 0;
        for (var i = 0; i < ta.test_cases.length; i++) {
            var testcase =  ta.test_cases[i];
            taTotalMaxMemory += Number(testcase.max_memory);
            taTotalAvgMemory += Number(testcase.avg_memory);
            taTotalRuntime += Number(testcase.runtime);
        }
        var taRating = getRating(taTotalMaxMemory, taTotalAvgMemory, taTotalRuntime);
      }

      // Generate table headers
      var table = $("<table></table>");
      var thead = $("<thead></thead>");
      var headRow = $("<tr></tr>");
      headRow.append($("<th>Nickname</th>"));
      for (var i = 0; i < students[0].test_cases.length; i++) {
        var testcase = students[0].test_cases[i];
        headRow.append($("<th>"+testcase.name+"</th>"));
      }
      headRow.append($("<th>Total Time</th>"));
      headRow.append($("<th>Total Max Memory</th>"));
      headRow.append($("<th>Total Avg Memory</th>"));
      headRow.append($("<th>Rating</th>"));
      headRow.append($("<th>Revision</th>"));
      headRow.append($("<th>Timestamp</th>"));
      thead.append(headRow);
      table.append(thead);


      // Generate Table Body
      var tbody = $("<tbody></tbody>");
      for (var i = 0; i < students.length; i++){
        var student = students[i];
        student.nickname = cleanse(student.nickname);
        var tBodyRow = $("<tr style = 'border-bottom: 2px solid rgba(225,233,241,255);'></tr>");
        tBodyRow.append($("<th>"+student.nickname+"</th>"));
        var testcases = student.test_cases;
        var totalTime = 0;
        var totalMaxMemory = 0;
        var totalAvgMemory = 0;
        var passedAll = true;
        // Add testcases
        for (var j = 0; j < testcases.length; j++) {
          var testcase = testcases[j];
          var datum = $("<div></div>")
            // .append($("<p>"+testcase.pts_earned+"/"+testcase.total_pts+" pts </p>"))
            .append($("<p> Runtime: "+Number(testcase.runtime).toPrecision(4)+" secs </p>"))
            .append($("<p> Max Memory: "+Number(testcase.max_memory).toPrecision(4)+" bytes </p>"))
            .append($("<p> Avg Memory: "+Number(testcase.avg_memory).toPrecision(4)+" bytes </p>"))
            .click(iifeClick(i,testcase.name));

          totalTime += Number(testcase.runtime);
          totalMaxMemory += Number(testcase.max_memory);
          totalAvgMemory += Number(testcase.avg_memory);
          var status = "";
          if (student.is_ta_solution) {
              status = "ta";
          } else if (testcase.pts_earned == testcase.total_pts) {
              status = "pass";
          } else {
              passedAll = false;
              status = "fail";
          }
          tBodyRow.append(
              $("<td></td>")
                .append(datum)
                .append(makeModal(i,testcase.name, testcase.output))
                .addClass(status)
            );
        }
        tBodyRow.append($("<td>"+totalTime.toPrecision(4)+" seconds</td>"));
        tBodyRow.append($("<td>"+totalMaxMemory.toPrecision(4)+" bytes</td>"));
        tBodyRow.append($("<td>"+totalAvgMemory.toPrecision(4)+" bytes</td>"));
        var normalizedRating = (getRating(totalMaxMemory, totalAvgMemory, totalTime) / taRating)*100;
        if (!passedAll) {
            normalizedRating = 9001;
        }
        var ratingStatus = "";
        if (passedAll && normalizedRating <= 200){
            ratingStatus = "pass";
        } else if (passedAll && normalizedRating > 200) {
            ratingStatus = "orange";
        } else {
            ratingStatus = "fail";
        }
        tBodyRow.append(
            $("<td>"+(normalizedRating.toFixed(2)+"%</td>"))
            .addClass(ratingStatus)
        );
        tBodyRow.append($("<td>"+student.last_revision+"</td>"));
        tBodyRow.append($("<td>"+student.time_stamp+"</td>"));
        tbody.append(tBodyRow);
      }
      table.append(tbody);
      $("#loading").remove();
      $("#content").append(table);
      var dataTable = table.DataTable( {
            bFilter:        false,
            scrollY:        "800px",
            scrollX:        true,
            scrollCollapse: true,
            paging:         false,
            order: [[ ta.test_cases.length + 4, "asc" ]]
        } );

      new $.fn.dataTable.FixedColumns( dataTable, {
          leftColumns: 1
      } );

      // Hack to resize the table correctly
      var timeoutHandle = setTimeout(function(){
          $(window).resize();
      }, 100);
    });
  }]);
