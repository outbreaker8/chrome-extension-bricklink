
//utility to get deep property pathes
get = function(obj, key) {
    return key.split(".").reduce(function(o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
}
//utility to get the right cellindex even with colspan
function computeTableHeaderCellIndexes(t) {
	var matrix = [];
	var lookup = {};
	var trs = t.getElementsByTagName('TR');
	for (var i=0; i<trs.length; i++) {
	    //check if maybe not a real line. Currently all other lines have className
	    if (trs[i].className == "") { continue; }
		var cells = trs[i].cells;
		for (var j=0; j<cells.length; j++) {
			var c = cells[j];
			var rowIndex = c.parentNode.rowIndex;
			var cellId = rowIndex+"-"+c.cellIndex;
			var rowSpan = c.rowSpan || 1;
			var colSpan = c.colSpan || 1
			var firstAvailCol;
			if(typeof(matrix[rowIndex])=="undefined") { matrix[rowIndex] = []; }
			// Find first available column in the first row
			for (var k=0; k<matrix[rowIndex].length+1; k++) {
				if (typeof(matrix[rowIndex][k])=="undefined") {
					firstAvailCol = k;
					break;
				}
			}
			lookup[cellId] = firstAvailCol;
			for (var k=rowIndex; k<rowIndex+rowSpan; k++) {
				if(typeof(matrix[k])=="undefined") { matrix[k] = []; }
				var matrixrow = matrix[k];
				for (var l=firstAvailCol; l<firstAvailCol+colSpan; l++) {
					matrixrow[l] = "x";
				}
			}
		}
	}
	return lookup;
}

function getActualCellIndex(table, cell) {
	return computeTableHeaderCellIndexes(table)[cell.parentNode.rowIndex+"-"+cell.cellIndex];
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

var orders = document.getElementsByClassName('tableT1')[0];

//Assumption: only one table found
for (var i = 0, row; row = orders.rows[i]; i++) {

    for (var j = 0, col; col = row.cells[j]; j++) {

        // scan header lines
        if ( i === 0) {
            switch(get(col, 'firstChild.firstChild.data')) {
                case "ID":
                    var colID = getActualCellIndex(orders, col);
                    break;
                case "Buyer":
                    var colBuyer = getActualCellIndex(orders, col);
                    break;
                case "Ship.":
                    var colShipping = getActualCellIndex(orders, col);
                    break;
                case "Grand":
                    var colTotal = getActualCellIndex(orders, col);
                    break;
                case "Order Status":
                    var colStatus = getActualCellIndex(orders, col);
                    break;
                case "Date":
                    var colDate = getActualCellIndex(orders, col);
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









