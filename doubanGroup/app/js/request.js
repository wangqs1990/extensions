function getData(trs) {
  if (!trs) {
    return;
  }
  var f = document.createDocumentFragment();
  var html = trs.map(function (item) {
    return '<tr><td><a href=\"' 
           + item[3] 
           + '\" target="_blank">' 
           + item[0]
           + '<td>' + item[1] + '</td>' 
           + '<td>' + item[2] + '</td>' 
           + "</td></tr>";
  }).join("");
  document.querySelector("#content tbody").innerHTML = html;
}

chrome.runtime.sendMessage({"command": "get"}, getData);