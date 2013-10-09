$(function(){
// Saves options to localStorage.
function save_options() {
  //save search resources
  var resourcesStr = "";
  $(".sortItem").each(function(){
    resourcesStr = resourcesStr + "," + $(this).text();
  });
  if(resourcesStr)
    resourcesStr = resourcesStr.substr(1);
  localStorage["resources"] = resourcesStr;

  // Update status to let user know options were saved.
  var status = $("#status");
  status.html("Options Saved.");
  setTimeout(function() {
    status.html("");
  }, 3000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var resources = localStorage["resources"];
  //restore search resources 
  if (!resources) {//if it is first time
    $("input[name='resources']").each(function(){
      $(this).prop('checked', true);
      $('<li/>', {
        "class": "sortItem",
        text: $(this).val()
      }).appendTo('#sortable');
    });
  }else{
    var resourcesArray = resources.split(',');
    var item = null;
    $("input[name='resources']").each(function(){
      if($.inArray($(this).val(), resourcesArray) !== -1){
        $(this).prop('checked', true);
      }
    });
    for(item in resourcesArray){
      $('<li/>', {
        "class": "sortItem",
        text: resourcesArray[item]
      }).appendTo('#sortable');
    }
  }
}

//change the sort list
$("input[name='resources']").change(function(){
  if($(this).is(':checked')){
    $('<li/>', {
      "class": "sortItem",
      text: $(this).val()
    }).appendTo('#sortable');
  }else{
    var name = $(this).val();
    $(".sortItem").each(function(){
      if($(this).text() == name){
        $(this).remove();
      }
    });
  }
});

restore_options();
$('#save').click(save_options);

$( "#sortable" ).sortable();
$( "#sortable" ).disableSelection();
});
