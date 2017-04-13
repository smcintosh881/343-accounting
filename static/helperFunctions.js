function sendRequest(url, method, requestData, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (callback) {
              callback(xmlHttp.responseText);
          }
      }
    };
    xmlHttp.open(method, url, true);
    xmlHttp.send(requestData ? requestData: null);
}