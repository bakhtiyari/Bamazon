CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(13) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,3) NOT NULL,
	stock_quantity INT(150) NOT NULL,
	PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
  ("Computer ", "Electronics", 800.00, 50),
  ("Smart TV ", "Electronics", 1400.00, 70),
  ("Moonlight", "Movies", 20.00, 35),
  ("Arrival", "Movies", 30.00, 40),
  ("Shirt", "Clothing", 25.00, 85),
  ("Jeans", "Clothing", 35.00, 52),
  ("washer", "Appliances", 400.00, 10),
  ("Dryer", "Appliances", 430.00, 16),
  ("Padlocks", "Hardware", 10.00, 15),
  ("Super Glue", "Hardware", 5.00, 70);
