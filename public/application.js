FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
google.load("jquery", "1.4.2");

google.setOnLoadCallback(function() {
  handleEvents();
  $("#a1").focus();
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
    $("#data").find("h2").html("");
    document.title = "Bitboard Builder";
  });

  $save.click(function() {
    var name = $name.val();
    var bitboard = serialize();
    var decimal = parseInt(bitboard, 2);
    $("#decimal").html(decimal);
    $("#hexadecimal").html(decimal.toString(16));
    $.post("/", { name: name, bits: bitboard }, function(bitboards) {
      $("#bitboards").html(bitboards);
      $("#data").find("h2").html(name);
      document.title = name + " - Bitboard Builder";
      $name.val("");
    });
  });

  $("form").submit(function(event) {
    event.preventDefault();
  });

  $(".delete").click(function(event) {
    var $item = $(this);
    var name = $item.siblings(".filename").html();
    var result = confirm("Are you sure you want to delete '" + name + "'?");
    if (result) {
      $.post("/delete/" + $item.parent().attr("id"), function(data) {
        $item.parent().fadeOut();
      });
    }
    event.preventDefault();
  });

  $(".filename").click(function(event) {
    var $item = $(this);
    var name = $item.html();
    $.get("/" + $item.parent().attr("id"), function(bitboard) {
      deserialize(bitboard);
      $("#data").find("h2").html(name);
      document.title = name + " - Bitboard Builder";
      var decimal = parseInt(bitboard, 2);
      $("#decimal").html(decimal);
      $("#hexadecimal").html(decimal.toString(16));
    })
    event.preventDefault();
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
