FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
google.load("jquery", "1.4.2");
google.setOnLoadCallback(function() {
  loaded();
});
function loaded() {
  var $name = $("#name");
  var $save = $("#save");
  var $reset = $("#reset");
  $name.keyup(function() {
    $save.attr("disabled", $name.val().length == 0);
  });
  $reset.click(function() {
    reset();
  });
}
function reset() {
  for (var f = 0; f < 8; f++) {
    for (var r = 1; r < 9; r++) {
      $("#" + FILES[f] + r).val("0");
    }
  }
}
