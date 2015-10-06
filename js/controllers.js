contestApp.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('./data/results.json').success(function(students) {

      var cleanse = function (unsafe) {
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;")
         .substring(0,15);
      };

      var getRating = function(totalMaxMemory, totalAvgMemory, totalRuntime) {
          return .6 * Number(totalMaxMemory) + .2 * Number(totalAvgMemory) + .2 * Number(totalRuntime);
      }

      $scope.students = students;
      var ta;
      for (var i = 0; i < students.length; i++) {
          var student = students[i];
          if (student.is_ta_solution) {
              ta = student;
              break;
          }
      }
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
      headRow.append($("<th>Timestamp</th>"));
      headRow.append($("<th>Revision</th>"));
      thead.append(headRow);
      table.append(thead);

      var iifeClick = function (i, name) {
        return function () {$("#"+i+name).foundation('reveal', 'open')};
      }

      var makeModal = function (i, name, output) {
        var modal = $('<div id="'+i+name+'" class="reveal-modal medium" data-reveal aria-labelledby="'+i+name+'Title" aria-hidden="true" role="dialog"></div>');
        // var valgrind = "Checking for memory leaks...\nTrying to compile your code...\nSuccessfully compiled your code..\n==9109== Memcheck, a memory error detector\n==9109== Copyright (C) 2002-2013, and GNU GPL'd, by Julian Seward et al.\n==9109== Using Valgrind-3.10.0 and LibVEX; rerun with -h for copyright info\n==9109== Command: timeout -k 5 -s INT 15 ./mpwearables/svn/abdu2/mpwearables/wearable_server 49500 49501\n==9109==\n==9111== Memcheck, a memory error detector\n==9111== Copyright (C) 2002-2013, and GNU GPL'd, by Julian Seward et al.\n==9111== Using Valgrind-3.10.0 and LibVEX; rerun with -h for copyright info\n==9111== Command: ./mpwearables/svn/abdu2/mpwearables/wearable_server 49500 49501\n==9111==\n==9109== Warning: ignored attempt to set SIGKILL handler in sigaction();\n==9109==the SIGKILL signal is uncatchable'\n"
        modal
          .append($('<h2 id="'+i+name+'Title">'+name+' Debug Log</h2>'))
          .append($('<p class="lead">Terminal Output</p>'))
          .append($('<pre class = "terminal">'+output+'</pre>'))
          .append($('<a class="close-reveal-modal" aria-label="Close">&#215;</a>'))
        return modal;
      }

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
        tBodyRow.append(
            $("<td>"+((getRating(totalMaxMemory, totalAvgMemory, totalTime) / taRating)*100).toFixed(2)+"%</td>")
            .addClass()
        );
        tBodyRow.append($("<td>"+student.time_stamp+"</td>"));
        tBodyRow.append($("<td>"+student.last_revision+"</td>"));
        tbody.append(tBodyRow);
      }
      table.append(tbody);
      $("#loading").remove();
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
      var timeoutHandle = setTimeout(function(){
          $(window).resize();
      }, 100);

      $(":input").keyup(function(e) {
          clearTimeout(timeoutHandle);
          timeoutHandle = setTimeout(function(){
              $(window).resize();
          }, 100);
      });
    });
  }]);
