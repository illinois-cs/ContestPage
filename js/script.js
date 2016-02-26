// Takes in a string and escapes all unsafe characters
var cleanse = function (unsafe) {
  return unsafe
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#39;")
   .substring(0,15);
};
// returns an iife
var iifeClick = function (i, name) {
  return function () {$("#"+i+name).foundation('reveal', 'open')};
}

// Returns a modal
var makeModal = function (i, name, output) {
  var modal = $('<div id="'+i+name+'" class="reveal-modal medium" data-reveal aria-labelledby="'+i+name+'Title" aria-hidden="true" role="dialog"></div>');
  modal
    .append($('<h2 id="'+i+name+'Title">'+name+' Debug Log</h2>'))
    .append($('<p class="lead">Terminal Output</p>'))
    .append($('<pre class = "terminal">'+output+'</pre>'))
    .append($('<a class="close-reveal-modal" aria-label="Close">&#215;</a>'))
  return modal;
}
