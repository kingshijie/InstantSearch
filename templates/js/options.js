$(function(){
// Saves options to localStorage.
function save_options() {
  //save search resources
  var resourcesStr = "";
  $("input[name='resources']").each(function(){
    if($(this).prop('checked')){
      resourcesStr = resourcesStr + "," + $(this).val();
    }
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
  if (!resources) {
    $("input[name='resources']").each(function(){
      $(this).prop('checked', true);
    });
  }else{
    var resourcesArray = resources.split(',');
    $("input[name='resources']").each(function(){
      if($.inArray($(this).val(), resourcesArray) !== -1){
        $(this).prop('checked', true);
      }
    });
  }
}

restore_options();
$('#save').click(save_options);
});
