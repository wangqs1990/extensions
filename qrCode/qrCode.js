chrome.tabs.query(
    { active: true },
    function(tabs) {
        tab = tabs[0];
        var content = document.querySelector(".content");
        var p = document.createElement("p");
        p.appendChild(document.createTextNode(tab.title));
        content.appendChild(p);
        var img = new Image();
        img.src = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|4&chl=" 
        + encodeURIComponent(tab.url);
        content.appendChild(img);
    }
);