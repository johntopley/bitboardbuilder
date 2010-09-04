FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
google.load("jquery", "1.4.2");

google.setOnLoadCallback(function() {
  handleEvents();
});

function handleEvents() {
  var $name = $("#name");
  var $save = $("#save");
  var $reset = $("#reset");
  $name.keyup(function() {
    $save.attr("disabled", $name.val().length === 0);
  });
  $reset.click(function() {
    reset();
    $("#decimal").html("0");
    $("#hexadecimal").html("0");
  });
  $save.click(function() {
    var bitboard = serialize();
    var decimal = parseInt(bitboard, 2);
    $("#decimal").html(decimal);
    $("#hexadecimal").html(decimal.toString(16));
  });
  $("form").submit(function() {
    return false;
  });
}

function deserialize(bitboard) {
  walkBoard(function(rank, file, count) {
    $("#" + FILES[file] + rank).val(bitboard[count]);
  });
}

function reset() {
  walkBoard(function(rank, file, count) {
    $("#" + FILES[file] + rank).val("0");
  });
}

function serialize() {
  var bitboard = "";
  walkBoard(function(rank, file, count) {
    bitboard += $("#" + FILES[file] + rank).val();
  });
  return bitboard;
}

function walkBoard(callback) {
  var count = -1;
  for (var rank = 1; rank < 9; rank++) {
    for (var file = 0; file < 8; file++) {
      count++;
      callback(rank, file, count);
    }
  }
}
