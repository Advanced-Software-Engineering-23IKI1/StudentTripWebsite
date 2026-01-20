function $ID (id) {
  return document.getElementById(id)
}

function $ALL (param) {
  return document.querySelectorAll(param);
}

// fetches json data
async function jsonData(){
  const response = await fetch("daten.json"); 
  const data = await response.json();
  return data;
}

//renders navigation bar and the footer
function renderPartials() {
	renderPartial("navbar")
	renderPartial("footer")
}

//loads a partial by a given name
async function loadPartial(name) {
  const code = await fetch("partials/"+name+".html").then(response => response.text())
  Handlebars.registerPartial(name, code)
}

//renders a partial by a given name
async function renderPartial(name) {
  await loadPartial(name)
  render($ID(name+"-template"),$ID(name),{})
}

// get all coins from the local storage
function getCoins() {
  const coins = localStorage.getItem("coins");
  if (!coins)
    return [];
  else
    return JSON.parse(coins);
}

//resets coins
async function resetCoins(coins){
  return Promise.all([...Array(coins.length).keys()].map(async (i) => {
    coins[i].id = parseInt(i);

    await getAPIData(coins[i].coincapID).then((result) => {
      value = []
      for (let x = (result.data.length - 1); x >= 0; x--)
        value.push({time: result.data[x].date, value: result.data[x].priceUsd});
      coins[i].value = value;
      coins[i].curValue = round(parseFloat(value[0].value) + 0.00005, 4);
      coins[i].curRate = round(value[0].value / value[1].value * 100 - 100, 4);
    });

    await getAPIAdvancedData(coins[i].coincapID).then((result) => {
      coins[i].supply = parseFloat(result.data.supply);
      coins[i].maxSupply = parseFloat(result.data.maxSupply);
      if (!coins[i].maxSupply)
        coins[i].maxSupply = "Unknown";
      coins[i].marketCapUsd = parseFloat(result.data.marketCapUsd);
      coins[i].volumeUsd24Hr = parseFloat(result.data.volumeUsd24Hr);
    });
  })).then(() => {
      localStorage.setItem("coins", JSON.stringify(coins))
      localStorage.setItem("orders", JSON.stringify([]))
    }
  );
}

//reloads api for updating the coin data 
async function reloadAPI(coins){
  return Promise.all([...Array(coins.length).keys()].map(async (i) => {
    coins[i].id = parseInt(i);

    await getAPIData(coins[i].coincapID).then((result) => {
      value = []
      for (let x = (result.data.length - 1); x >= 0; x--)
        value.push({time: result.data[x].date, value: result.data[x].priceUsd});
      coins[i].value = value;
      coins[i].curValue = round(parseFloat(value[0].value) + 0.00005, 4);
      coins[i].curRate = round(value[0].value / value[1].value * 100 - 100, 4);
    });

    await getAPIAdvancedData(coins[i].coincapID).then((result) => {
      coins[i].supply = parseFloat(result.data.supply);
      coins[i].maxSupply = parseFloat(result.data.maxSupply);
      if (!coins[i].maxSupply)
        coins[i].maxSupply = "Unknown";
      coins[i].marketCapUsd = parseFloat(result.data.marketCapUsd);
      coins[i].volumeUsd24Hr = parseFloat(result.data.volumeUsd24Hr);
    });
  })).then(() => {
      localStorage.setItem("coins", JSON.stringify(coins))
    }
  );
}

function round(val, amount){
  return Math.round(val * Math.pow(10, amount)) / Math.pow(10, amount);
}

//removes an order by given id from the local storage 
function removeFromOrdersByID(id) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
  for(let i = 0; i < orders.length; i++) {
    if(orders[i].id != id) {
      new_orders.push(orders[i])
    }
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

//changes the amount of an order by given id
function changeOrderAmount(id, amount) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
    for(let i = 0; i < orders.length; i++) {
      let new_order = orders[i]
      if(orders[i].id === id) {
        new_order.amount = amount
      }
      new_orders.push(new_order)  
    }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function updateOrder(id, amount) {
  if(amount === -1) {
    removeFromOrdersByID(id)
  } else {
    changeOrderAmount(id, amount)
  }
}

//returns the index if the order is in the given array
function contains_order(orders, id) {
  for(let i = 0; i< orders.length; i++) {
    if(orders[i].id === id) {
      return i;
    }
  }
  return -1;
}

//adds an order to the local storage
function addOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  if(orders) {
    var id = contains_order(orders, order.id)
     if(id == -1) {
     orders.push(order)
     new_orders = orders
   } else {
     orders[id].amount += order.amount
     new_orders = orders
   }
  } else {
    new_orders = [order]
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

// loads orders from the local storage
function getOrders() {
  let orders = JSON.parse(localStorage.getItem("orders"))
  if (!orders) return {ord: []};
  new_orders = []
  orders.forEach((order) => {
    const coin = getCoinByID(order.id)
    new_order = {...coin, amount: order.amount, 
      end_price: round(coin.curValue*order.amount + 0.005, 2)}
    new_orders.push(new_order)
  })
  return {ord: new_orders}
}

//adds an order to the order history per local storage
function addToOrderHistory(newOrder){
  let orderHist = JSON.parse(localStorage.getItem("orderHist"));
  if (!orderHist)
    orderHist = [newOrder];
  else
    orderHist.push(newOrder);

  localStorage.setItem("orderHist", JSON.stringify(orderHist));
}

//returns time stamp of current date
function getTimestamp(){
  const d = new Date();
  return {
    date : pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + "." + d.getFullYear().toString(),
    time : pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds())
  };

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }
}

//returns a coin by given id
function getCoinByID(id) {
  const coins = getCoins();
  if (id >= coins.length) return {};
  else if(id < 0) return {};
  else return coins[id];
}

//returns fetched api data of a given coin id
async function getAPIData(cid){
  return fetch(url = "https://api.coincap.io/v2/assets/" + cid + "/history?interval=d1").then(response => {
    if (!response.ok) {
      throw new Error('API Network response was not ok');
    }
    return response.json();
  })
}

//returns advanced fetched api data of a given coin id
async function getAPIAdvancedData(cid){
  return fetch(url = "https://api.coincap.io/v2/assets/" + cid).then(response => {
    if (!response.ok) {
      throw new Error('API Network response was not ok');
    }
    return response.json();
  })
}

//returns the parsed string value of a given date
function toDate(date) {
  return date.slice(8, 10) + "." + date.slice(5, 7) + "." + date.slice(0, 4);
}

//maps the data of a coin with given id to a chart
function toChartData(id, amount){
  const coin = getCoinByID(id);
  labels = [];
  data = [];
  for (let i = amount - 1; i >= 0; i--){
    labels.push(toDate(coin.value[i].time));
    data.push(coin.value[i].value);
  }

  return {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            data: data,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
        }]
    },
    options: {
      scales: {
          yAxes: [{
            ticks: {
                beginAtZero: false
            }
          }]
      },
      legend: {
          display: false
      }
    }
  }
}

//renders handlebars template objects
function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}

//returns the discount value of a given discount
function getDiscountValue(discount) {
  if (discount == null)
    return 0
  const value = loadDiscounts().values[discount]
  if (Number.isInteger(value)) {
    return value
  } else {
    return (Number.parseFloat(value.slice(0, value.length - 1)) / 100) * Number.parseFloat($ID("total").innerText.substring(2))
  }
}

//updates current discount and removes current one if used
function updateDiscount(discount, used) {
  const discounts = loadDiscounts()
  if (used) {
      discounts.available.splice(discounts.available.indexOf(discounts.current), 1)
  }
  discounts.current = discount
  writeDiscounts(discounts)
}

// loads all discounts and their value from the local storage
function loadDiscounts() {
  var discounts = localStorage.getItem("discounts");
  if(discounts) {
      return JSON.parse(discounts)
  } else {
    discounts = {current: null, available: ["Michi10", "HAPPY10"], values: {"Michi10": 10, "HAPPY10": "0.1%"}}
    localStorage.setItem("discounts", JSON.stringify(discounts))
      return discounts
  }
  
}

// wirtes the discounts to the local storage
function writeDiscounts(discounts) {
  localStorage.setItem("discounts", JSON.stringify(discounts))
}