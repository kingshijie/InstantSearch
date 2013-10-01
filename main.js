//get selected text
function getSelectedText() { 
    if (window.getSelection) { 
        // This technique is the most likely to be standardized. 
        // getSelection() returns a Selection object, which we do not document. 
        return window.getSelection().toString(); 
    } 
    else if (document.getSelection) { 
        // This is an older, simpler technique that returns a string 
        return document.getSelection(); 
    } 
    else if (document.selection) { 
        // This is the IE-specific technique. 
        // We do not document the IE selection property or TextRange objects. 
        return document.selection.createRange().text; 
    } 
}

function top_stories(o){      
  var items = o.query.results.video;
  var output = '<h1>Youtube</h1>';
  var no_items=items.length;
  for(var i=0;i<no_items;i++){
    var title = items[i].title;
    var link = items[i].url; 
    var id = items[i].id;
    output += "<div class='thumbs'><a href='#' onmousedown='window.open(\"" + link +"\")' target='_blank'><img alt='thumbs' src='" + items[i].thumbnails.thumbnail[0].content + "'></a>";
    output += "<a href='#' onmousedown='window.open(\"" + link +"\")' target='_blank'>"+title+"</a></div>"; 
  }
  // console.log($('#youtube'));
  // console.log(output);
  $('#youtube').html(output);
}

//get json array
function GetJArray(selIndex,arr){
    var index = 0;
    for(i in arr)
    {
        if(index == selIndex){
           return arr[i].extract;
       }
       index += 1;
    }
}

function listPhotos(output){
  var items = output.query.results.photo;
  var list = '<h1>Flickr</h1>';
  var no_items = items.length;
  for(var i = 0; i < no_items; i++){
    var farm_id = items[i].farm;
    var server_id = items[i].server;
    var id = items[i].id;
    var secret = items[i].secret;
    var photo_size = "s";
    var base_link = "http://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_";
    var photo_link =  base_link +photo_size + ".jpg";
    var big_link = base_link + "b.jpg";
    list += "<a href='#' onmousedown='window.open(\"" + big_link +"\")'  target='_blank'><img alt='thumbnails' src='" + photo_link + "'></a>";
  }
  console.log('flickr=' + list);
  $('#flickr').html(list);

}

//insert pop up div into content
var div = '<div  id="effect" class="ui-widget-content ui-corner-all"><div id="wiki"></div><div id="flickr"></div><div id="youtube"></div></div>';
$('body').append(div);
$('#effect').hide();

var textTemp = '';
//trigger search when select content
$('body').mouseup(function(e){
    $('#flickr').html('');
    //hide the popup created before
    var popup = $('#effect');
    if(popup){
        popup.hide('clip', {}, 100, null);
    }
    //show popup
    var text = "";
    //only popup with selection length less than 30 characters
    if((text = getSelectedText()) && text.length < 30 && textTemp !== text){
        console.log('text=' + text);
        //set position
        popup.css("position","absolute");
        var left = e.clientX + window.pageXOffset;
        if($(window).width() - e.clientX < popup.width()){
            left = e.clientX - popup.width();
        }
        popup.css("left", left);
        popup.css("top", e.clientY + window.pageYOffset);
        //replace all space charecters to %20
        text = text.replace(/\s+/g,'%20');
        textTemp = text;
        var videoNum = 2;
        var youtubeUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20youtube.search%20where%20query%3D%22'+ text +'%22%20limit%20' + videoNum + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        popup.show('slide', {}, 500, function(e){
            console.log('url='+youtubeUrl+',show success');
        });

        // wiki
        var wikiURL = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=' + text;
        //youtube
        // $.ajax({
        //     type:"GET",
        //   url: wikiURL
        // }).done(function(data){
        //     console.log(data);
        //   });
        $.getJSON(wikiURL, function (data) {
            var wikiError = false;
            for(i in data.query.pages){
                if(i == -1) wikiError = true;
                break;
            }
            console.log(wikiError);
            if(!wikiError){
                var result = GetJArray(0,data.query.pages).substring(0,300);
                result = '<h1>Wikipedia</h1>' + result;
                result += "...<a href='#' onmousedown='window.open(\"http://en.wikipedia.org/wiki/" + text + "\")' target='_blank'>More&gt;&gt;</a>";
                console.log(result);
                $('#wiki').html(result);
            }
        });

        var flickrUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.search%20where%20text%3D%22' + text + '%22%20and%20api_key%3D%22173a0aeef599a9ac1442d50459db6a61%22%20limit%203&format=json';
        console.log(flickrUrl);
        //flickr
        $.ajax({
            type:"GET",
          url: flickrUrl,
          cache:false
        }).done(function(html){
            console.log(html);
            listPhotos(html);
          });

        //youtube
        $.ajax({
            type:"GET",
          url: youtubeUrl
        }).done(function(html){
            // console.log(html);
            top_stories(html);
          });
    }
});

