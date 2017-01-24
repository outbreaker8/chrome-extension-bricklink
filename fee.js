var orders = document.getElementsByClassName('tableT1');
//alert("Table found. Contains " + orders.length + " orders");

//Assumption: only one table found
for (var i = 0, row; row = orders[0].rows[i]; i++) {
   //iterate through rows
   //rows would be accessed using the "row" variable assigned in the for loop

   //Add a column
         if(i === 0){
             //row.append('<td>Col+'iter+'</td>');
             var newCell = row.insertCell(-1);
			 //newCell.innerHTML = '[td] row:' + i + ', cell: ' + (tblBodyObj.rows[i].cells.length - 1)
			 newCell.innerHTML = 'Add Paypal';
         }else{
         	 var newCell = row.insertCell(-1);
         	 newCell.innerHTML = '<a href=""><img width="16" height="16" src="/images/invoice16N.gif" alt="Invoice" title="Invoice" border="0" align="ABSMIDDLE"></a>';
         	 //row.append('<td><input type="checkbox" name="cb'+i+'"/></td>');
         }

   for (var j = 0, col; col = row.cells[j]; j++) {
     //iterate through columns
     //columns would be accessed using the "col" variable assigned in the for loop
   }  
}

