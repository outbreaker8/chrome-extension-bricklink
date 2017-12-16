function openInfo(orderID) {
    var feeInfo = document.getElementById('feeInfo');
    document.getElementById('feeInfo').style.display = "block";
    document.getElementById('feeInfoContent').innerHTML = "";

    form = document.createElement("form");
    form.id = "feeInfoForm";
    feeInfoContent.appendChild(form);

    var rowCandidates = document.getElementsByName(orderID);
    var row = rowCandidates[0].parentElement.parentElement;
    var cols = getColDefinition();

    newLine("Order ID", cols.id, "ID", row);
    newLine("Buyer", cols.buyer, "Buyer", row);
    newLine("Status", cols.status, "Order Status ", row);
    newLine("Shipping Cost", cols.shipping, "Ship.", row);
    newLine("Current Grand Total", cols.total, "Grand", row);

    //calculate fee
    var countryLow = ["Germany", "Belgium", "Bulgaria", "Croatia", "Denmark", "Estonia", "Finland", "France",
        "Greece", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
        "Austria", "Poland", "Portugal", "Romania", "Sweden", "Slovakia", "Slovenia", "Spain",
        "Czech Republic", "Hungary", "United Kingdom", "Cyprus", "Norway", "Iceland", "Liechtenstein"];

    var total = row.cells[cols.total].innerHTML.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, ' ').split(" ").pop();
    var country = row.cells[cols.buyer - 1].firstChild.alt;

    var rate;
    if (countryLow.indexOf(country) > -1) {
        rate = 0.019;
    } else {
        rate = 0.039;
    }
    var fee = total * rate + 0.35;
    fee = Math.round(fee * Math.pow(10, 2)) / Math.pow(10, 2).toFixed(2);

    //output
    var feeInfoForm = document.getElementById("feeInfoForm");
    feeInfoForm.appendChild(document.createElement("BR"));
    feeInfoForm.appendChild(document.createElement("BR"));
    var l = document.createElement("label");
    l.className = "feeLabel";
    l.htmlFor = "fee";
    l.innerHTML = "Suggested paypal fee";
    feeInfoForm.appendChild(l);

    var i = document.createElement("input");
    i.setAttribute('type', "text");
    i.setAttribute('name', "fee");
    i.setAttribute('value', fee);
    i.setAttribute('readOnly', true);

    feeInfoForm.appendChild(i);
    feeInfoForm.appendChild(document.createElement("BR"));
    feeInfoForm.appendChild(document.createElement("BR"));
    feeInfoForm.appendChild(document.createElement("BR"));

    var l = document.createElement("text");
    l.className = "feeLabel";
    l.innerHTML = "Applied rate: " + (rate * 100) + "%";
    feeInfoForm.appendChild(l);


}

function newLine(text, col, name, row) {
    var feeInfoForm = document.getElementById("feeInfoForm");
    var l = document.createElement("label");
    l.className = "feeLabel";
    l.htmlFor = name;
    l.innerHTML = text;
    feeInfoForm.appendChild(l);

    var i = document.createElement("input");
    i.setAttribute('type', "text");
    i.setAttribute('name', name);

    var value = row.cells[col].innerHTML.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, ' ');
    if ((value == "") || (name == "Order Status ")) {
        //could be input field
        value = row.cells[col].firstChild.value;
    }
    i.setAttribute('value', value);
    i.setAttribute('readOnly', true);

    feeInfoForm.appendChild(i);
    feeInfoForm.appendChild(document.createElement("BR"));
}

function getColDefinition() {
    //Assumption: only one table found
    var orders = document.getElementsByClassName('tableT1')[0];
    var cols = new Object();
    for (var j = 0, col; col = orders.rows[0].cells[j]; j++) {


        switch(get(col, 'firstChild.firstChild.data')) {
            case "ID":
                cols.id = getActualCellIndex(orders, col);
                break;
            case "Buyer":
                cols.buyer = getActualCellIndex(orders, col);
                break;
            case "Ship.":
                cols.shipping = getActualCellIndex(orders, col);
                break;
            case "Grand":
                cols.total = getActualCellIndex(orders, col);
                break;
            case "Order Status ": // _space_ seems to be an error on the new status page
            case "Order Status":
                cols.status = getActualCellIndex(orders, col);
                break;
            case "Date":
                cols.date = getActualCellIndex(orders, col);
                break;
            case "":
            case null:
                break;
            default:
                //console.log(get(col, 'firstChild.firstChild.data'));
        }
    }
    return cols;
}

//utility to get deep property pathes
function get(obj, key) {
    return key.split(".").reduce(function (o, x) {
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