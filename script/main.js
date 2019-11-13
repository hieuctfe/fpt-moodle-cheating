fetch('https://captcha.alibaba.com/get_img?identity=alibaba.com&sessionid=8b867c2d9a2c418e825f55cc8a0bb31b', {
    mode: "cors"
})
    .then(function(response) {
        return response;
    })
    .then(function(myJson) {
        console.log(myJson);
    });


$(document).ready(function () {
    var imgURL = chrome.runtime.getURL("img/flag.png");
    $('body').prepend("<div style='position: relative; height: 80px; background: white'></div>");
    $('body').prepend('<img style="width: 100vw; position: fixed; top: 0px; z-index: 99999" src="'+ imgURL +'"/>');
    $('body').prepend("<div id='aw' style='position:fixed; z-index: 999999; bottom: 0px; color: lightgray'></div>");
    console.log(data.data.length);
});

function initText() {
    $("body").mouseup(function () {
        var selectedText = "";
        let aw = "";
        if (window.getSelection) {
            selectedText = window.getSelection().toString();
            if (selectedText != "" && selectedText != null) {
                let max = 0;
                $(data.data).each(function (idx, el) {
                    let tempPercent = similarity(el.q.trim().toLowerCase(),selectedText.trim().toLowerCase());
                    if (tempPercent > max) {
                        max = tempPercent;
                        aw = `[${Math.round(tempPercent * 100) / 100}] - ${el.a}`;
                        // return false;
                    }
                })
            }
        }
        $('#aw').text(aw);
    });
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

//////

var anwserContent = document.getElementsByClassName("answer");
var questionContent = document.getElementsByClassName("qtext");

function getObject() {
    // return JSON.parse(localStorage.getItem("source"));
    return data.data;
}

function cutString(text) {
    return text.substring(Math.round(text.length / 5), Math.round((text.length / 5) + 25)).trim().toLowerCase();
}

function checkString(text) {
    let source = getObject();
    let matching = source.filter(function (el) {
        // if (el.qtext.indexOf(text) > 0) {
        // if (el.q.toLowerCase().indexOf(text.toLowerCase()) > 0) {
        if (similarity(el.q.toLowerCase(), text.toLowerCase()) >= 0.8) {
            return true;
        }
        return false;
    })
    return matching
}

function checkAw(aw, ind) {
    let aws = anwserContent[ind];
    let choose = aws.children;
    let flag = false;
    if (choose) {
        for (let i = 0; i < choose.length; i++) {
            // let temp = choose[i].innerText.substring(2, choose[i].innerText.length - 2).trim();
            let temp = choose[i].innerText.substring(2, choose[i].innerText.length).trim();
            // console.log(aw);
            // console.log(temp);
            if (similarity(aw,temp) >= 0.75) {
                choose[i].children[0].click();
                flag = true;
            }
        }
    }
    return flag;
}


function startRun() {
    let numq = 0;
    let numclick = 0;
    for (let i = 0; i < questionContent.length; i++) {
        // let newString = cutString(questionContent[i].innerText);
        let aw = checkString(questionContent[i].innerText);
        if (aw.length > 0) {
            let num = i + 1;
            aw.forEach(function (el) {
                if (checkAw(el.a, i)) {
                    console.log("đã click câu " + num + ": " + el.a);
                    numclick++;
                } else {
                    numq++;
                    console.log("Chưa click câu " + num + ": " + el.a);
                }
            })
        }
    }
    console.log("Đã click: " + numclick + " Chưa click: " + numq);
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://tphinvest.com.vn/scripts/sourcejs.js", true);
// xhr.onreadystatechange = function () {
//     if (xhr.readyState == 4) {
//         let arr = JSON.parse(xhr.responseText);
//         let ok = false;
//         let usertext = $('.usertext')[0].innerHTML.toLowerCase().split(' ');
//         console.log(usertext);
//         $(arr).each(function (idx,el) {
//             let leng = usertext.length;
//             let temp = el.toLowerCase().split(' ');
//             let mer = [...temp,...usertext].unique();
//             if  (leng == mer.length) {
//                 ok = true;
//             }
//         });
//         if(xhr.responseText != "" && ok) {
//             if (anwserContent && questionContent) {
                startRun();
                initText();
//             }
//         }
//     }
// }
// xhr.send();
//

