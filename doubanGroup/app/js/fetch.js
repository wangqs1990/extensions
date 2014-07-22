(function (window, chrome) {

var lastFetch, groups, keywords;

var notifyArr = JSON.parse(localStorage.getItem("notifications")) || [];

chrome.windows.onRemoved.addListener(function () {
    localStorage.setItem("notifications", JSON.stringify(notifyArr));
});

var topicIdReg = /\/(\d+)\/$/
//http://www.douban.com/group/topic/46856294/
function pushNotifyArr (topicIdStr) {
    var topicId = parseInt(topicIdStr, 10);
    if (~notifyArr.indexOf(topicId)) {
        return false;
    } else {
        //缓存1000个关键topic
        if (notifyArr.length > 1000) {
            notifyArr.pop();
        }
        notifyArr.push(topicId);
        return true;
    }
}

//更新option
function updateOption () {
    groups = JSON.parse(localStorage.getItem("groups")) || [];
    keywords = JSON.parse(localStorage.getItem("keyword")) || [];
}

function fetch (groupId) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.douban.com/group/" + groupId + "/discussion?start=0", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        
            var p = new DOMParser();
            var d = p.parseFromString(xhr.responseText, "text/html");
            var trs = [].slice.call(d.querySelectorAll("#content table tr"), 1);
            var table =  trs.map(function (item) {
                    var children = item.children;
                    var a = children[0].querySelector("a");
                    return [
                       a.getAttribute('title'),
                       children[1].querySelector("a").textContent,
                       children[3].textContent,
                       a.getAttribute('href')
                    ];    
                })
                .filter(function (item) {
                    var title = item[0], isKeyWord = false;
                    for (var i = 0, length = keywords.length; i < length; i++ ){
                        if (item[0].contains(keywords[i])) {
                            isKeyWord = true;
                        }
                    }
                    return isKeyWord;
                });
            if (table.length === 0) {
                return ;
            }
            lastFetch = lastFetch.concat(table);

            var willNotifyArr = table.filter(function (item) {
                                    return pushNotifyArr(topicIdReg.exec(item[3])[1]);
                                });
            if (willNotifyArr.length === 0) {
                return ;
            }
            var index = 0;
            var opt = {
                "type":"list",
                "title":"您关注的\"" +  d.querySelector("div.title a").textContent + "\"有新的消息",
                "message":"",
                "iconUrl":"icon.gif",
                "items": willNotifyArr.map(function (item) {return {title: (++index + ". "), message: item[0]}})
            };
            chrome.notifications.create(groupId, opt, function(id){console.log(id)})
            chrome.runtime.sendMessage({
                command: "updateFetch",
                data: table
            });
        }
    };
    xhr.send();
}

var alarmsCb = {
    fetch: function () {
              lastFetch = [];
              groups.forEach(function (item) {
                  fetch(item);
              });
           }
};

var alarmOpt = {
    periodInMinutes: 1
};

//注册alarm
chrome.alarms.create("fetch", alarmOpt);
chrome.alarms.onAlarm.addListener(function (alarm) {
    alarmsCb[alarm.name] && alarmsCb[alarm.name](alarm);
});

function getMsg (msg, sender, res) {
    res(lastFetch);
}

var msgCb = {
    "get": getMsg,
    "update-option": updateOption
};

//添加message对应的命令和方法
chrome.runtime.onMessage.addListener(function (msg, sender, res) {
    var command = msg.command;
    if (command) {
        msgCb[command] && msgCb[command](msg.data, sender, res);
    }
});

//点击打开对应小组URL
chrome.notifications.onClicked.addListener(function (groupId) {
    chrome.tabs.create({url: "http://www.douban.com/group/" + groupId + "/discussion?start=0", active: true}, function () {})
});

(function init () {
    updateOption();
    alarmsCb.fetch();
})();
})(this, chrome);