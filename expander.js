chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.tabs.update(request.tab, {url: request.redirect});

    // Display a successful message.
    var a = document.createElement("a");
    a.setAttribute("href", request.redirect);
    var text = document.createTextNode(request.redirect);
    a.appendChild(text);
    document.body.appendChild(a);
});

var short_url = "";
var api_key = "YOUR SINA WEIBO API KEY";

var urlExpander = {

  expand_url: function (url) {
      // Get current tab URL.
      this.tab_url();
  },

  tab_url: function () {
    chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
        // Get short url in your browser address bar.
        var short_url = tabs[0].url;
        short_url = short_url.substring(0, short_url.indexOf('?'));

        // Send request to expand short URL.
        var api_url = "http://api.t.sina.com.cn/short_url/expand.json?" +
            "url_short=" + short_url + "&source=" + api_key;
        var req = new XMLHttpRequest();
        req.open("GET", api_url, false);
        req.send(null);

        var data = JSON.parse(req.responseText);
        var url_long = data[0].url_long;
        chrome.runtime.sendMessage({redirect: url_long, tab: tabs[0].id});
    });
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  urlExpander.expand_url();
});
