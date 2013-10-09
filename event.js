// content script listener
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if(request.key){
      sendResponse({value: localStorage[request.key]});
    }
  });