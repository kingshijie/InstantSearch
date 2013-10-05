var popoverId = 'InstantSearchSelectedArea';
//get selected Text
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

function surroundSelection() {
    var span = document.createElement("span");
    span.id = popoverId;
    
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

function removeSelection() {
    var id = "#" + popoverId;
    $(id).contents().unwrap();
}

function top_stories(o){      
  var items = o.query.results.video;
  var output = '<h1 class="stalk">Youtube</h1>';
  var no_items=items.length;
  for(var i=0;i<no_items;i++){
    var title = items[i].title;
    var link = items[i].url; 
    var id = items[i].id;
    output += "<div class=\"leaf3\"><div class='ytbThumb'><a href='#' onmousedown='window.open(\"" + link +"\")' target='_blank' title='" + title + "'><img alt='thumbs' src='" + items[i].thumbnails.thumbnail[0].content + "'></a></div>";
    output += "<div class='ytbTitle'><a href='#' onmousedown='window.open(\"" + link +"\")' title='" + title + "' target='_blank'>"+title+"</a></div></div>"; 
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
  var list = '<h1 class="stalk">Flickr</h1>';
  // var list = '<div class="popover_h1">Flickr</div>';
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
    list += "<div class=\"leaf2\"><a href='#' onmousedown='window.open(\"" + big_link +"\")'  target='_blank'><img alt='thumbnails' src='" + photo_link + "'></a></div>";
  }
  console.log('flickr=' + list);
  $('#flickr').html(list);

}




function getWiki(keyword){
    // // wiki
    var wikiURL = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=' + keyword;
    $.getJSON(wikiURL, function (data) {
        var wikiError = false;
        for(i in data.query.pages){
            if(i == -1) wikiError = true;
            break;
        }
        console.log(wikiError);
        if(!wikiError){
            var result = '<div class="popover_p1">' + GetJArray(0,data.query.pages).substring(0,300) + '</div>';
            result = '<h1 class="stalk">Wikipedia</h1>' + result;
            result += "...<a href='#' onmousedown='window.open(\"http://en.wikipedia.org/wiki/" + keyword + "\")' target='_blank'>More&gt;&gt;</a>";
            result = '<div class="leaf6">' + result + '</div>';
            console.log(result);
            $('#wiki').html(result);
        }
    });
}

function getFlickr(keyword){
    var flickrUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.search%20where%20text%3D%22' + keyword + '%22%20and%20api_key%3D%22173a0aeef599a9ac1442d50459db6a61%22%20limit%203&format=json';
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
}

function getYoutube(keyword){
    //youtube
    var videoNum = 2;
    var youtubeUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20youtube.search%20where%20query%3D%22'+ keyword +'%22%20limit%20' + videoNum + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    $.ajax({
        type:"GET",
      url: youtubeUrl
    }).done(function(html){
        // console.log(html);
        top_stories(html);
      });
}

 // Initialize the scope plugin
// $.scoped();
//insert pop up div into content
var btCssURL = chrome.extension.getURL("libs/bootstrap/css/bootstrap.min.css");
var popover = '<div id="popover"><div class="pine"><div class="branch" id="wiki"></div><div class="branch" id="flickr"></div><div class="branch" id="youtube"></div></div></div>';


function getPopoverContent(){
    return popover;
}


//trigger search when select content
$('body').mouseup(function(e){

    //hide the popup created before
    if($('#' + popoverId)){
        $('#' + popoverId).popover('hide');
        removeSelection();
    }
    //show popup
    var keyword = "";
    //only popup with selection length less than 30 characters
    if((keyword = getSelectedText()) && keyword.length < 30){
        console.log('keyword=' + keyword);
        //surround with span tag
        surroundSelection();
        $('#' + popoverId).popover({
            trigger :'manual',
            html: true,
            placement: function(context, source){
                var toLeft = $(source).offset().left - $(window).scrollLeft();
                var toTop = $(source).offset().top - $(window).scrollTop();
                // alert(toLeft + "," + toTop + "," + ($(window).height()-toTop));
                var horizonRange = 300;
                var verticalRange = 290;
                if (toLeft < horizonRange) {
                    return "right";
                }

                if ($(window).width() - toLeft < horizonRange) {
                    return "left";
                }


                if (toTop < verticalRange){
                    return "bottom";
                }

                if ($(window).height() - toTop < verticalRange){
                    return "top";
                }

                return "bottom";
            },
            content: function(){ return getPopoverContent()},
            container: 'body'
        }).popover('show');

        // //replace all space charecters to %20
        keyword = keyword.replace(/\s+/g,'%20');

        getWiki(keyword);

        getFlickr(keyword);

        getYoutube(keyword);
    }
});

