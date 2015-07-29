contestApp.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var cleanse = function (string) {
        
      }
      $scope.students = students;
      var table = $("<table></table>");
      var thead = $("<thead></thead>");
      var headRow = $("<tr></tr>");
      headRow.append($("<th>Nickname</th>"));
      for (var i = 0; i < students[0].test_cases.length; i++) {
        var testcase = students[0].test_cases[i];
        headRow.append($("<th>"+testcase.name+"</th>"));
      }
      headRow.append($("<th>Timestamp</th>"));
      thead.append(headRow);
      table.append(thead);
      var tbody = $("<tbody></tbody>");
      // var tbody = $("");
      for (var i = 0; i < students.length; i++){
        var student = students[i];
        var tBodyRow = $("<tr></tr>");
        tBodyRow.append($("<th>"+student.nickname+"</th>"));
        var testcases = student.test_cases;
        for (var j = 0; j < testcases.length; j++) {
          var testcase = testcases[j];
          var datum = $("<div></div>")
            .append($("<p>"+testcase.pts_earned+"/"+testcase.total_pts+" pts </p>"))
            .append($("<p>"+testcase.runtime+" secs </p>"))
            .append($("<p>"+testcase.max_memory+" bytes </p>"));

          tBodyRow.append(
            $("<td></td>")
              .append(datum)
              .addClass(testcase.pts_earned == testcase.total_pts ? "pass": "fail")
            );
        }
        tBodyRow.append($("<td>"+student.time_stamp+"</td>"));
        tbody.append(tBodyRow);
      }
      table.append(tbody);
      $("#content").append(table);
      console.log(table);
      var dataTable = table.DataTable( {
            scrollY:        "500px",
            scrollX:        true,
            scrollCollapse: true,
            paging:         false
        } );

      new $.fn.dataTable.FixedColumns( dataTable, {
          leftColumns: 1,
          // rightColumns: 1
      } );
      $(window).resize();
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
