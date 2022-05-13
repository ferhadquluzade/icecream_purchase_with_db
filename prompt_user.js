const inquirer = require("inquirer");

// connecting db
const mysql = require("mysql2");

const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "fiko1234",
  database: "icecream",
  waitForConnection: true,
  connectionLimit: 10,
});

const pool = conn.promise();

//inquirer
function ask() {
  inquirer
    .prompt([
      {
        name: "mehsul",
        message: "ne isteyirsen",
        type: "list",
        choices: ["satmaq", "almaq"],
      },
    ])
    .then((choice) => {
      if (choice.mehsul == "satmaq") {
        addDb();
      } else if (choice.mehsul == "almaq") {
        delDb();
      }
    });
}

function run() {
  ask();
}

function addDb() {
  inquirer
    .prompt([
      {
        name: "flavor",
        message: "dad-i elave et",
        type: "input",
      },
      {
        name: "price",
        message: "qiymeti elave et",
        type: "input",
      },
      {
        name: "quantity",
        message: "sayi elave et",
        type: "input",
      },
    ])
    .then((result) => add(result.flavor, result.price, result.quantity));
}

async function add(flavor, price, quantity) {
  const result = await pool.query(`
      insert into products(flavor,price,quantity) values('${flavor}','${price}','${quantity}') `);
  list();
  run();
}

async function delDb() {
  var product_list = await list();
  //   console.log(product_list)
  await inquirer
    .prompt([
      {
        name: "id",
        message: "id-ni elave et",
        type: "input",
      },
      {
        name: "quantity",
        message: "sayi elave et",
        type: "input",
      },
    ])
    .then(async (result) => {
      for (var element of product_list) {
        if (element.id == result.id) {
          if (element.quantity < parseInt(result.quantity)) {
            console.log("We dont have so many ice cream😞 ");
            // delDb();
          }
          if (element.quantity < 0) {
            del(parseInt(element.id));
            // delDb();
          }
          console.log(`Total amount:💲${result.quantity * element.price}`);
          const ansr = await pool.query(`
            update products set quantity = ${
              element.quantity - result.quantity
            } where id = ${element.id} ;
            `);
          delDb();
        }
      }
    });
}

async function del(id) {
  const result = await pool.query(`
        delete from products where id=${id}`);
  run();
}

async function list() {
  const result = await pool.query(`
      select * from products `);
  console.log(result[0]);
  return result[0];
}

run();
