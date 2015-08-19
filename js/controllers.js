contestApp.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var cleanse = function (unsafe) {
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .substring(0,15);
      };

      $scope.students = students;
      var table = $("<table></table>");

      var thead = $("<thead></thead>");
      var headRow = $("<tr></tr>");
      headRow.append($("<th>Nickname</th>"));
      for (var i = 0; i < students[0].test_cases.length; i++) {
        var testcase = students[0].test_cases[i];
        headRow.append($("<th>"+testcase.name+"</th>"));
      }
      headRow.append($("<th>Total Time</th>"));
      headRow.append($("<th>Total Memory</th>"));
      headRow.append($("<th>Timestamp</th>"));
      thead.append(headRow);
      table.append(thead);

      var tbody = $("<tbody></tbody>");
      for (var i = 0; i < students.length; i++){
        var student = students[i];
        var tBodyRow = $("<tr style = 'border-bottom: 2px solid rgba(225,233,241,255);'></tr>");
        tBodyRow.append($("<th>"+cleanse(student.nickname)+"</th>"));
        var testcases = student.test_cases;
        var totalTime = 0;
        var totalMemory = 0;
        for (var j = 0; j < testcases.length; j++) {
          var testcase = testcases[j];
          var datum = $("<div></div>")
            .append($("<p>"+testcase.pts_earned+"/"+testcase.total_pts+" pts </p>"))
            .append($("<p>"+testcase.runtime+" secs </p>"))
            .append($("<p>"+testcase.max_memory+" bytes </p>"));
          totalTime += Number(testcase.runtime);
          totalMemory += Number(testcase.max_memory);

          var modal = $('<div id="myModal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog"><h2 id="modalTitle">Awesome. I have it.</h2><p class="lead">Your couch.  It is mine.</p><p>Im a cool paragraph that lives inside of an even cooler modal. Wins!</p><a class="close-reveal-modal" aria-label="Close">&#215;</a></div>');
          tBodyRow.append(
            $("<td style = 'white-space: nowrap;'></td>")
              .append(datum)
              .addClass(testcase.pts_earned == testcase.total_pts ? "pass": "fail")
            );
        }
        tBodyRow.append($("<td style = 'white-space: nowrap;'>"+totalTime.toFixed(6)+"</td>"));
        tBodyRow.append($("<td style = 'white-space: nowrap;'>"+totalMemory.toFixed(6)+"</td>"));
        tBodyRow.append($("<td style = 'white-space: nowrap;'>"+student.time_stamp+"</td>"));
        tbody.append(tBodyRow);
      }
      table.append(tbody);

      $("#content").append(table);

      var dataTable = table.DataTable( {
            scrollY:        "800px",
            scrollX:        true,
            scrollCollapse: true,
            paging:         false
        } );

      new $.fn.dataTable.FixedColumns( dataTable, {
          leftColumns: 1
      } );
      // Hack to resize the table correctly
      $(":input").keyup(function(e) {
        $(window).resize();
      });
      $(window).resize();
    });
  }]);
