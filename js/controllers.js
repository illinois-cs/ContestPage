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

      var iifeClick = function (i, name) {
        return function () {$("#"+i+name).foundation('reveal', 'open')};
      }

      var makeModel = function (i, name) {
        var modal = $('<div id="'+i+name+'" class="reveal-modal medium" data-reveal aria-labelledby="'+i+name+'Title" aria-hidden="true" role="dialog"></div>');
        var valgrind = "Checking for memory leaks...\nTrying to compile your code...\nSuccessfully compiled your code..\n==9109== Memcheck, a memory error detector\n==9109== Copyright (C) 2002-2013, and GNU GPL'd, by Julian Seward et al.\n==9109== Using Valgrind-3.10.0 and LibVEX; rerun with -h for copyright info\n==9109== Command: timeout -k 5 -s INT 15 ./mpwearables/svn/abdu2/mpwearables/wearable_server 49500 49501\n==9109==\n==9111== Memcheck, a memory error detector\n==9111== Copyright (C) 2002-2013, and GNU GPL'd, by Julian Seward et al.\n==9111== Using Valgrind-3.10.0 and LibVEX; rerun with -h for copyright info\n==9111== Command: ./mpwearables/svn/abdu2/mpwearables/wearable_server 49500 49501\n==9111==\n==9109== Warning: ignored attempt to set SIGKILL handler in sigaction();\n==9109==the SIGKILL signal is uncatchable'\n"
        modal
          .append($('<h2 id="'+i+name+'Title">'+name+' Debug Log</h2>'))
          .append($('<p class="lead">Terminal Output</p>'))
          .append($('<code class = "terminal">'+valgrind+'</code>'))
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
        var totalMemory = 0;
        for (var j = 0; j < testcases.length; j++) {
          var testcase = testcases[j];
          var datum = $("<div></div>")
            .append($("<p>"+testcase.pts_earned+"/"+testcase.total_pts+" pts </p>"))
            .append($("<p>"+testcase.runtime+" secs </p>"))
            .append($("<p>"+testcase.max_memory+" bytes </p>"))
            .click(iifeClick(i,testcase.name));

          totalTime += Number(testcase.runtime);
          totalMemory += Number(testcase.max_memory);

          tBodyRow.append(
              $("<td></td>")
                .append(datum)
                .append(makeModel(i,testcase.name))
                .addClass(testcase.pts_earned == testcase.total_pts ? "pass": "fail")
            );
        }
        tBodyRow.append($("<td>"+totalTime.toFixed(6)+"</td>"));
        tBodyRow.append($("<td>"+totalMemory.toFixed(6)+"</td>"));
        tBodyRow.append($("<td>"+student.time_stamp+"</td>"));
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
      var timeoutHandle = $(window).setTimeout(function(){
          $(window).resize();
      }, 1000);

      $(":input").keyup(function(e) {
          $(window).clearTimeout(timeoutHandle);
          timeoutHandle = $(window).setTimeout(function(){
              $(window).resize();
          }, 1000);
      });
    });
  }]);
