/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//functions  that can be made in to their own files for modularity

//TOGGLE/LOAD CUSTOMER SECTION *IF COOKIE SESSION USERTYPE = CUSTOMER

//TOGGLE/LOAD RESTAURANT OWNER SECTION *IF COOKIE SESSION USERTYPE = RESTAURANT OWNER

const cart = [];
let cartObject = {};

//////////////////////////////////LOAD MENU example data in nosql///////////////
const categories = {
  1: "Appetizer",
  2: "Main",
  3: "Dessert",
  4: "Drink",
  5: "Side",
};

//note that when using sql for getting data it has to go through route and then ajaxrequst to receive the data in JSON format.

const getMenu = (restaurant_id) => {
  $.get(`/api/menu/${restaurant_id}`, function (data) {
    const menu = data.menu;

    renderMenu(menu, categories);
  }).fail(function (xhr, status, error) {
    // redirect to /error -> error.ejs
    console.log(error);
  });
};
// temp css below SHOULD BE to be moved into scss file

//declare output for cart picing and quantit and subtotal for running totaly////////////////////WILL BE USED FOR POST//////////////////

orderItems = {};
const subTotalValues = {};
let subTotal = 0;

const updateSubTotalSum = (subTotal) => {
  subTotal += Object.values(subTotalValues).reduce(
    (acc, curr) => acc + curr,
    0
  );
};

////////////////////////////////////////////////////////////////////////////////

//Function to render the menu with abiility for user to add or remove quantities of each item from the menu

const renderMenu = function (menu, categories) {
  // /////////////////// Define CONTAINER ///////////////////////////////
  const $menuContainer = $(".menu-container");

  /////////////////////////////  title  /////////////////////////////////////
  const $menuTitle = $("<h2>").addClass("section-title").text("Menu");
  // const menuList = $("<p>").text(`${menu}`);
  // $menuContainer.append(menuList);
  //////////////////////////Menu list by Category //////////////////////////////

  // SET EACH CATEGORY CONTAINER  ///This currently is at O n^2. Need to refactor. Via sql and one for loop
  Object.keys(categories).forEach((category) => {
    const $menuListByCategory = $("<article>")
      .addClass(`menu-category`)
      .html(`<strong> ${categories[category]} </strong>`)
      .css({
        display: "flex",
        "flex-direction": "column",
        "justify-content": "space-between",
        margin: "5%",
      });

    //--------------------------------------------------------------//
    // ADD CONTAINER FOR EACH MENU ITEM IN THE CATEGORY

    for (const item of menu) {
      // Keep track of quantity for each item
      orderItems[item.id] = 0;

      if (JSON.stringify(item.category_id) === category) {
        // Create menu item container
        const $item = $("<div>").addClass("menu-item card-hov-shadow").css({
          display: "flex",
          "flex-direction": "column",
          "justify-content": "space-around",
          // border: "solid 1px black",
          border: "solid 1px black",
          "border-radius": "2em",
          padding: "2.5em",
          // padding: "10px",
          margin: "10px 0",
          overflow: "hidden",
        });

        //--------------------------------------------------------------//

        ////////////Add Header for item name and price
        const $itemHeader = $("<header>")
          .addClass("menu-item card-header")
          .css({ display: "flex", "justify-content": "space-between" });

        // Create menu item name element
        const $itemName = $("<p>")
          .addClass("menu-name")
          .text(item.name)
          .css({ fontWeight: "bold" });

        // Create menu item price element
        const $itemPrice = $("<p>")
          .addClass("menu-price")
          .text("$ " + (item.unit_price / 100).toFixed(2));

        // Add the name and price to card header
        $itemHeader.append($itemName, $itemPrice);

        //--------------------------------------------------------------//
        ////////////////Add Body - For description and image

        const $itemBody = $("<div>").addClass("menu-item card-body").css({
          display: "flex",
          "justify-content": "space-between",
          alignItems: "center",
        });

        // Create menu item description element
        const $itemDescription = $("<p>")
          .addClass("menu-description")
          .text(item.description);

        // Create menu item image element (replace with actual image source)
        const $itemImage = $("<img>") //img tag when picture available
          .addClass("menu-img")
          // .text(item.picture_url)
          .attr("src", item.picture_url)
          .css({ width: "100px", height: "100px" }); //for img needs to be changed into em...
        // .css({"font-size" : "350%"});

        // Add the description and image to card body
        $itemBody.append($itemDescription, $itemImage);

        //--------------------------------------------------------------//
        /////////////////Add Footer - for adding/removing quantity and quantity amount

        // Create  footer container for the menu item
        const $itemFooter = $("<footer>")
          .addClass("menu-item card-footer")
          .css({
            display: "flex",
            "justify-content": "space-between",
            alignItems: "center",
          });

        // Create the quantity container
        const $quantityContainer = $("<div>").addClass("quantity-container");

        // Create the quantity counter placeholder
        const $quantityLabel = $("<span>").text("Quantity:");
        const $quantityValue = $("<span>").addClass("quantity-value").text("0");

        // Create the add and remove buttons and container
        const $quantityButtonContainer = $("<div>")
          .addClass("quantity-buttons")
          .css({
            display: "flex",
            "justify-content": "space-around",
            width: "25%",
          });

        const $addButton = $("<button>")
          .addClass("add-button ")
          .text("Add")
          .css({
            padding: "0.5em",
            color: "#F6AA1C",
            "background-color": "#941B0C",
            "border-radius": "4px",
            "font-family": '"Source Sans 3", sans-serif',
            "font-size": "16px",
            "font-weight": "bold",
            width: "200px",
            cursor: "pointer",
          })

          .on("click", function () {
            //add to quantitiy counter
            orderItems[item.id]++;
            $quantityValue.text(orderItems[item.id]);

            //Update Subtotal value for each item qty * price
            // subtotal per item
            subTotalValues[item.id] = orderItems[item.id] * item.unit_price;

            // subtotals sum
            subTotal = Object.values(subTotalValues).reduce(
              (acc, curr) => acc + curr,
              0
            );

            //update checout container info
            $subTotalElement.text("Subtotal: $" + (subTotal / 100).toFixed(2));
          });

        const $removeButton = $("<button>")
          .addClass("remove-button")
          .css({
            padding: "0.5em",
            color: "#F6AA1C",
            "background-color": "#941B0C",
            "border-radius": "4px",
            "font-family": '"Source Sans 3", sans-serif',
            "font-size": "16px",
            "font-weight": "bold",
            width: "200px",
            cursor: "pointer",
          })

          .text("Remove")
          .on("click", function () {
            //remove from quantity counter
            if (orderItems[item.id]) orderItems[item.id]--;
            $quantityValue.text(orderItems[item.id]);

            //Update Subtotal value for each item qty * price
            subTotalValues[item.id] = orderItems[item.id] * item.unit_price;

            // subtotals sum
            subTotal = Object.values(subTotalValues).reduce(
              (acc, curr) => acc + curr,
              0
            );

            //update checout container info
            $subTotalElement.text("Subtotal: $" + (subTotal / 100).toFixed(2));
          });

        // Add the add and remove buttons and the quantity counter to the item footer
        $quantityButtonContainer.append($addButton, $removeButton);

        $quantityContainer.append($quantityLabel, $quantityValue);

        $itemFooter.append($quantityButtonContainer, $quantityContainer);
        //--------------------------------------------------------------//

        // Add the item header, body, and footer to the menu item container
        $item.append($itemHeader, $itemBody, $itemFooter);

        // Add item to category container
        $menuListByCategory.append($item);
      }
    }

    ////////////////////////////////////////////////////////////////////////////

    //Add menu list to container for each category
    $menuContainer.append($menuListByCategory);
  });

  //Add title
  $menuContainer.prepend($menuTitle);
  ///////////////////////// Checkout Container ///////////////////////////////

  //checkout button and subtotal
  const $checkoutContainer = $("<section>").addClass("checkout-container");
  //checkout button
  const $checkoutButton = $("<button>")
    .addClass("checkout-button")
    .text("Checkout")

    .on("click", function () {
      const items = Object.keys(orderItems);
      const quantity = Object.values(orderItems);
      const timestamp = new Date().getTime();

      for (let item of items) {
        const cartObject = {};
        if (orderItems[item] !== 0) {
          cartObject.customer_id = userId;
          cartObject.restaurant_id = menu[item - 1].restaurant_id;
          cartObject.menu_item_id = item;
          cartObject.status_id = 1;
          cartObject.quantity = orderItems[item];
          cartObject.unit_price = menu[item - 1].unit_price;
          cartObject.ordered_time = new Date().toString();
          cartObject.item_name = menu[item - 1].name; //
          cartObject.cart_id = String(userId) + "-" + String(timestamp);
          cart.push(cartObject);
        }
      }

      // neeed route to post to order table /hide menuview and toggle cartview
      showCart(cart);
      $(".cart-container").slideToggle();
    });

  const $subTotalElement = $("<p>")
    .addClass("subtotal-element")
    .text("Subtotal: $" + (subTotal / 100).toFixed(2));

  $checkoutContainer.append($checkoutButton, $subTotalElement);

  //Add checkout container
  // if (orderItems)
  $menuContainer.append($checkoutContainer);
};
////////////////////////////////////////////////////////////////////////////////
