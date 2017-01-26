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
        //iterate through columns
        //columns would be accessed using the "col" variable assigned in the for loop
        if (j === 0 && i > 0) {
            console.log(col);
//    	var name = col.
        }
    }

    //Add a column
    if (i === 0) {
        var newCell = row.insertCell(-1);
        //newCell.innerHTML = '[td] row:' + i + ', cell: ' + (tblBodyObj.rows[i].cells.length - 1)
        newCell.innerHTML = 'Add Paypal';
    } else {
        var newCell = row.insertCell(-1);
        newCell.innerHTML = '<img width="16" height="16" src="/images/invoice16N.gif" alt="Invoice" title="Invoice" border="0" align="ABSMIDDLE" onclick = "openInfo()">';
    }


}







