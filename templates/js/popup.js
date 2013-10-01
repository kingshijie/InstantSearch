$(function() {
  $('.hintTitle').click(function(e){
    var hintName = $(this).text();
    var hintId = '#' + hintName + 'Hint';
    if($(hintId).css('display') == 'none')
      $(hintId).css('display', 'block');
    else
      $(hintId).css('display', 'none');
  });
});