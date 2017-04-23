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

    newLine("Order ID", cols.id, "orderId", row);
    newLine("Buyer", cols.buyer, "buyer", row);
    newLine("Status", cols.status, "status", row);
    newLine("Shipping Cost", cols.shipping, "shipping", row);
    newLine("Current Grand Total", cols.total, "total", row);

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
    if (value == "") {
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
    var orders = document.getElementsByClassName('tableT1');
    var cols = new Object();
    for (var j = 0, col; col = orders[0].rows[0].cells[j]; j++) {

        // scan header lines
        switch (get(col, 'firstChild.firstChild.data')) {
            case "ID":
                cols.id = j;
                break;
            case "Buyer":
                cols.buyer = j;
                break;
            case "Ship.":
                cols.shipping = j;
                break;
            case "Grand":
                cols.total = j;
                break;
            case "Order Status ": // _space_ seems to be an error on the new status page
            case "Order Status":
                cols.status = j;
                break;
            case "Date":
                cols.date = j;
                break;
            case "":
            case null:
                break;
            default:
            //var text = get(col, 'firstChild.firstChild.data');
            //console.log(text);
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