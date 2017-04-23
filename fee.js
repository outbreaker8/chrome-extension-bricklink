
//utility to get deep property pathes
get = function(obj, key) {
    return key.split(".").reduce(function(o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
}

//inject css
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('feeStyles.css');
(document.head || document.documentElement).appendChild(style);

//inject scipt
var s = document.createElement('script');
s.src = chrome.extension.getURL('feeScript.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

//prepare pop-up
var div = document.createElement("div");
div.id = "feeInfo";
div.className = "modal";

var divContent = document.createElement("div");
divContent.id = "feeInfoContent";
divContent.className = "modal-content";
divContent.innerHTML = "Hello";
div.appendChild(divContent);

var span = document.createElement("span");
span.className = "feeInfoClose";
divContent.innerHTML = "&times;";
divContent.appendChild(span);

document.getElementById("brick-link").appendChild(div);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == div) {
        div.style.display = "none";
    }
}

var orders = document.getElementsByClassName('tableT1');


//Assumption: only one table found
for (var i = 0, row; row = orders[0].rows[i]; i++) {

    for (var j = 0, col; col = row.cells[j]; j++) {

        // scan header lines
        if ( i === 0) {
            switch(get(col, 'firstChild.firstChild.data')) {
                case "ID":
                    var colID = j;
                    break;
                case "Buyer":
                    var colBuyer = j;
                    break;
                case "Ship.":
                    var colShipping = j;
                    break;
                case "Grand":
                    var colTotal = j;
                    break;
                case "Order Status":
                    var colStatus = j;
                    break;
                case "Date":
                    var colDate = j;
                    break;
                case "":
                    break;
                default:
                    //console.log(get(col, 'firstChild.firstChild.data'));
            }
        }

        // store the order ID for everything after the first row
        if (j === 0 && i > 0) {
            var orderID = col.firstChild.name;
        }
    }

    //Add a column
    if (i === 0) {
        var newCell = row.insertCell(-1);
        //newCell.innerHTML = '[td] row:' + i + ', cell: ' + (tblBodyObj.rows[i].cells.length - 1)
        newCell.innerHTML = 'Calculate Paypal';
    } else {
        var newCell = row.insertCell(-1);
        newCell.innerHTML = '<img width="16" height="16" src="/images/invoice16N.gif" alt="Invoice" title="Invoice" border="0" align="ABSMIDDLE" onclick = "openInfo(\'' + orderID + '\')">';
    }


}









