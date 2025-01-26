'use strict';

//? Selecting elements
const btnAddCart = document.querySelectorAll('.shop-item-button');
const btnPurchase = document.querySelector('.btn-purchase');
const bandName = document.querySelector('.band-name');   // getting the header bandname
const cartItems = document.querySelector('.cart-items');
const cattItemPrice = document.querySelector('.cart-quantity-input');
const cartTotalPrice = document.querySelector('.cart-total-price');
const cartRow = document.querySelector('.cart-row');
const cartPriceElements = document.querySelectorAll('.cart-price');
const shopListCartContainer = document.querySelector('.cart-container');

//? Important variables 
const item = {};
const addedItems = new Set();
let isCartEmpty = true;

const generateMessage = function (text, type) {
    const html = `
    <div class="message-container ${type >= 1 ? "info" : "error"}">
        <div class="message-content">${text}</div>
    </div>
    `;

    document.querySelector('body').insertAdjacentHTML('afterbegin', html);

    setTimeout(() => {
        const msg = document.querySelector('.message-container');
        msg.style.transition = 'transform 0.5s ease';
        msg.style.transform = 'translate(-50%, 15%)';
    }, 10);
}

// => 0 for error and 1 for info message

const removeMessage = function () {
    const msg = document.querySelector('.message-container');

    msg.style.transition = 'transform 0.5s ease';
    msg.style.transform = 'translate(-50%, -20%)';
    msg.remove();
}

const messageManage = function (text, style) {
    generateMessage(text, style);

    setTimeout(() => {
        removeMessage();
    }, 1000);
}


//? Purchase message
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-purchase');

    if (!btn) return;

    if(isCartEmpty) {
        messageManage('No items in cart!!', 0);
        return;
    }

    messageManage('Purchase has been done', 1);

    // Need to kind of do reset
    cartItems.innerHTML = ``;
    addedItems.clear();
    bandName.scrollIntoView({behavior: 'smooth'});
    updateTotalPrice();
})


//! Main things

//? Caculating price
document.addEventListener('input', (e) => {
    const quan = e.target.closest('.cart-quantity-input');

    if (!quan) return;

    const quanRow = quan.closest('.cart-row');
    const price = quanRow.querySelector('.cart-price');

    if (quan.value) {
        const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
        const totalPrice = (numericPrice * quan.value).toFixed(2);
        price.textContent = `$${totalPrice}`;
    }

    updateTotalPrice();
});


//? Removing an item
document.addEventListener('click', function (e) {
    e.preventDefault();
    const btn = e.target.closest('.btn-remove');

    if (!btn) return;

    const row = btn.closest('.cart-row');
    row.remove();
    addedItems.delete(row.dataset.name);
    console.log(addedItems)
    updateTotalPrice();
})


//? Calculating total price
const calculateTotalPrice = function () {
    const totalPrice = Array.from(document.querySelectorAll('.cart-price'))
        .map(priceElement => {
            const numericValue = parseFloat(priceElement.textContent.replace(/[^\d.]/g, '')) || 0;
            return isNaN(numericValue) ? 0 : numericValue;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
    if(totalPrice === 0) isCartEmpty = true;

    return totalPrice.toFixed(2);
};


const updateTotalPrice = function () {
    const total = calculateTotalPrice();
    cartTotalPrice.textContent = `$${total}`;
};


//? Creating item in cart item
const generateItem = function () {
    //debugger;
    const img = `<img class="cart-item-image cart-item" src="${item.url}">`

    const quantity = `<input type="number" class="cart-quantity-input cart-item-gap" min="1" max="10" value="1"> <button class="btn-danger btn btn-remove">REMOVE</button>`

    const html = `
        <div class="cart-row" data-name="${item.name}">
            <span class="cart-item cart-column cart-item-gap">${img} ${item.name}</span>
            <span class="cart-price cart-column"><span class="price-only"> ${item.price} </span></span>
            <span class="cart-quantity cart-column">${quantity}</span>
        </div>`


    if (addedItems.has(item.name)) {
        messageManage('Cannot have same item twice in cart', 0);
        return;
    }

    cartItems.insertAdjacentHTML('afterbegin', html);

    addedItems.add(item.name);
    console.log(addedItems)
}


//? kinda main event listener
document.addEventListener('click', function (e) {
    e.preventDefault();
    const addBtn = e.target.closest('.shop-item-button');

    if (!addBtn) return

    const shopItem = addBtn.closest('.shop-item');

    item.name = shopItem.querySelector('.shop-item-title').textContent;
    item.price = shopItem.querySelector('.shop-item-price').textContent;
    item.url = shopItem.querySelector('.shop-item-image').getAttribute('src');

    generateItem();
    updateTotalPrice();

    shopListCartContainer.scrollIntoView({behavior: 'smooth'})
    isCartEmpty = false;
})




