(function ($) {
    var groups = [], 
        localGroups = JSON.parse(localStorage.getItem("groups")) || [];
    var groupList = $("#group-list"),
        groupAdd = $("#group-add");
    localGroups.forEach(addGroup);
    groupList.addEventListener("click", function (event) {
        var elem = event.target;
        var groupId = elem.dataset.remove
        if (groupId) {
            groupList.removeChild(elem.parentElement.parentElement);
        }
        removeGroup(groupId);
    });
    groupAdd.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            addGroup(this.value);
            this.value=""; 
        }
    });
    function addDom (groupId) {
        var tr = document.createElement("tr");
        tr.innerHTML = '<th>' 
                       + groupId 
                       + '</th><th><button type="button" data-remove="'
                       + groupId 
                       + '"class="btn btn-default btn-sm" >delete</button></th>';
        groupList.appendChild(tr);
    }
    function addGroup (groupId) {
        var index = groups.indexOf(groupId);
        if (~index) {
            return ;
        }
        groups.push(groupId);
        localStorage.setItem("groups", JSON.stringify(groups));
        chrome.runtime.sendMessage({
            command: "update-option"
        });
        addDom(groupId);
    }
    function removeGroup(groupId) {
        var index = groups.indexOf(groupId);
        if (~index) {
            groups = groups.slice(0, index).concat(groups.slice(index + 1));
            localStorage.setItem("groups", JSON.stringify(groups));
            chrome.runtime.sendMessage({
                command: "update-option"
            });
        }
    }
})
((function (selector) { 
    return document.querySelector(selector);
}));

(function ($) {
    var groups = [], 
        localGroups = JSON.parse(localStorage.getItem("keyword")) || [];
    var groupList = $("#keyword-list"),
        groupAdd = $("#keyword-add");
    localGroups.forEach(addGroup);
    groupList.addEventListener("click", function (event) {
        var elem = event.target;
        var groupId = elem.dataset.remove
        if (groupId) {
            groupList.removeChild(elem.parentElement.parentElement);
        }
        removeGroup(groupId);
    });
    groupAdd.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            addGroup(this.value);
            this.value=""; 
        }
    });
    function addDom (groupId) {
        var tr = document.createElement("tr");
        tr.innerHTML = '<th>' 
                        + groupId 
                        + '</th><th><button type="button" data-remove="' 
                        + groupId 
                        + '"class="btn btn-default btn-sm" >delete</button></th>';
        groupList.appendChild(tr);
    }
    function addGroup (groupId) {
        var index = groups.indexOf(groupId);
        if (~index) {
            return ;
        }
        groups.push(groupId);
        localStorage.setItem("keyword", JSON.stringify(groups));
        chrome.runtime.sendMessage({
            command: "update-option"
        });
        addDom(groupId);
    }
    function removeGroup(groupId) {
        var index = groups.indexOf(groupId);
        if (~index) {
            groups = groups.slice(0, index).concat(groups.slice(index + 1));
            localStorage.setItem("keyword", JSON.stringify(groups));
            chrome.runtime.sendMessage({
                command: "update-option"
            });
        }
    }
})
((function (selector) { 
    return document.querySelector(selector);
}));