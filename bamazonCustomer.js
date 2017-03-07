// Required Node.js packages.
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// For cli-table
var chars = {
  'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
  'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚',
  'bottom-right': '╝', 'left': '║', 'left-mid': '╟', 'mid': '─',
  'mid-mid': '┼', 'right': '║', 'right-mid': '╢', 'middle': '│'
};

// For cli-table
var productsArray = [ ];

// Create MySQL connection.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});


connection.query("SELECT * FROM products", function(err, res){

	// Displaying the "Welcome to Bamazon" header using cli-table
	var header = new Table({head: ["         Welcome to Bamazon        "], chars: chars, colWidths: [39]});
	console.log("\n" + header.toString());

	// Displaying products' table header
	var table = new Table({
        head: ['ID', 'Product', 'PRICE'],
        chars: chars,
        colWidths: [5, 22, 10]
    });

    // Displaying the products information one item per row
    for (var i=0; i < res.length; i++) {
        var product = [res[i].item_id, res[i].product_name, "$" + res[i].price];
        productsArray.push(res[i].item_id);
        table.push(product);
    }
    console.log(table.toString() + "\n");
	// Handling the customer menu
	start();
});

// Handling the customer menu
var start = function() {
	inquirer.prompt([
		{
			type   : "input",
			name   : "itemID",
			message: "Please enter the ID of the product you would like to buy (or Q to exit)",			
			 
			validate: function(value) {
				// Validating the item ID being between 1 and 10
	      		if ((value >= 1) && (value <= 10)) {
				return true;
				}
				// If customer wants to quit the app
				else if ((value === "Q") || (value === "q")) {

					console.log("\n");

					process.exit();
				}
				// any invalid entry
				else {
					return false;
				}
				
			}
		}, 
		{
			type   : "input",
			name   : "itemQuantity",
			message: "How many units of this product would like to buy?",
			validate: function(value) {
	      		// Vlidating the quantity entered by the user is a positive integer
				if ((isNaN(value) === false) && (value !== undefined) && (value !== "") && (value > 0) && ((value % 1) === 0)) {
                return true;
            	} 
	            else {
	                console.log("\nPlease enter a valid number\n");
	                return false;
	            }
			}
		}
	]).then(function(answer) {
 
		// Parsing the quantity to integer
		requestedQuantitiyIntegered = parseInt(answer.itemQuantity)
		
		var query1 = "SELECT * FROM products WHERE item_id=?";

		// Querying the item user selected
		connection.query(query1, [answer.itemID], function(err, res) {
 
			// Checking the quantity requested Vs. quantity in stock 
			if (res[0].stock_quantity < requestedQuantitiyIntegered) {
               	
				// If not enough in stock, displaying the message with number of in stock
				var header1 = new Table({head: [`    Sorry, we only have ${res[0].stock_quantity} in stock.`], chars: chars, colWidths: [39]});
				console.log("\n" + header1.toString() + "\n");
 
 				// Going back to the main menu
				start();
            }
    		else {
    			var updatedStockQty = res[0].stock_quantity - requestedQuantitiyIntegered;
 				
 				// Calculating the total price
                var totalPurchase = res[0].Price * requestedQuantitiyIntegered;

                // updating the stock quantity in the table
	    		var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id=?";
				connection.query(query2, [updatedStockQty, answer.itemID], function(err, data) {
 
 					// Displaying the "Thank you" Header
					var header2 = new Table({head: ['  Thank you for placing your order! '], chars: chars, colWidths: [39]});
					console.log("\n" + header2.toString());

					// Displaying the purchase details using cli-table
					var header3 = new Table({head: [`          ORDER DETAILS:           `],
					  chars: chars,
					  style: { 'padding-left': 0, 'padding-right': 0 }, 
					  colWidths: [39]
					});
					header3.push(
					  	[` - Product Purchased: ${res[0].product_name}`]
					  , [` - Quantity: ${answer.itemQuantity}`]
					  , [` - Unit Price: \$${res[0].price}`]
					  , [` - TOTAL COST OF PURCHASE: \$${res[0].price * answer.itemQuantity}`]
					);
					console.log(header3.toString());

					// Going back to the main menu
					start();
				});
			}
		});
	});
};