// import products from "./products.js";
// const cart = () => {
//     let listCartHTML = document.querySelector('.listCart');
//     let iconCart = document.querySelector('.icon-cart');
//     let iconCartSpan = iconCart.querySelector('span');
//     let body = document.querySelector('body');
//     let closeCart = document.querySelector('.close');
//     let cart = [];

    
//     // open and close tab
//     iconCart.addEventListener('click', () => {
//         body.classList.toggle('activeTabCart');
//     })
//     closeCart.addEventListener('click', () => {
//         body.classList.toggle('activeTabCart');
//     })

//     const setProductInCart = (idProduct, value) => {
//         let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);
//         if(value <= 0){
//             cart.splice(positionThisProductInCart, 1);
//         }else if(positionThisProductInCart < 0){
//             cart.push({
//                 product_id: idProduct,
//                 quantity: 1
//             });
//         }else{
//             cart[positionThisProductInCart].quantity = value;
//         }
//         localStorage.setItem('cart', JSON.stringify(cart));
//         addCartToHTML();
//     }

//     const addCartToHTML = () => {
//         listCartHTML.innerHTML = '';
//         let totalQuantity = 0;
//         if(cart.length > 0){
//             cart.forEach(item => {
//                 totalQuantity = totalQuantity +  item.quantity;
//                 let newItem = document.createElement('div');
//                 newItem.classList.add('item');
//                 newItem.dataset.id = item.product_id;
    
//                 let positionProduct = products.findIndex((value) => value.id == item.product_id);
//                 let info = products[positionProduct];
//                 listCartHTML.appendChild(newItem);
//                 newItem.innerHTML = `
//                 <div class="image">
//                         <img src="${info.image}">
//                     </div>
//                     <div class="name">
//                     ${info.name}
//                     </div>
//                     <div class="totalPrice">$${info.price * item.quantity}</div>
//                     <div class="quantity">
//                         <span class="minus" data-id="${info.id}"><</span>
//                         <span>${item.quantity}</span>
//                         <span class="plus" data-id="${info.id}">></span>
//                     </div>
//                 `;
//             })
//         }
//         iconCartSpan.innerText = totalQuantity;
//     }
    
//     document.addEventListener('click', (event) => {
//         let buttonClick = event.target;
//         let idProduct = buttonClick.dataset.id;
//         let quantity = null;
//         let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
//         switch (true) {
//             case (buttonClick.classList.contains('addCart')):
//                 quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity+1;
//                 setProductInCart(idProduct, quantity);
//                 break;
//             case (buttonClick.classList.contains('minus')):
//                 quantity = cart[positionProductInCart].quantity-1;
//                 setProductInCart(idProduct, quantity);
//                 break;
//             case (buttonClick.classList.contains('plus')):
//                 quantity = cart[positionProductInCart].quantity+1;
//                 setProductInCart(idProduct, quantity);
//                 break;
//             default:
//                 break;
//         }
//     })

//     const initApp = () => {
        
//     if(localStorage.getItem('cart')){
//         cart = JSON.parse(localStorage.getItem('cart'));
//         addCartToHTML();
//     }
//     }
//     initApp();
// }




// export default cart;





import products from "./products.js";

const cart = () => {
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cart = [];
    let appliedPromoCode = null;

    // Promo codes and their corresponding discount percentages
    const promoCodes = {
        'ostad10': 10,
        'ostad5': 5
    };

    // Open and close cart tab
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });
    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    });

    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((item) => item.product_id == idProduct);
        if (value <= 0) {
            cart.splice(positionThisProductInCart, 1);
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity = value;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        addCartToHTML();
    };

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let subtotal = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let product = products.find((p) => p.id == item.product_id);
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${product.image}">
                    </div>
                    <div class="name">
                        ${product.name}
                    </div>
                    <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity">
                        <span class="minus" data-id="${product.id}"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${product.id}">></span>
                    </div>
                `;
                subtotal += product.price * item.quantity;
            });
        }

        iconCartSpan.innerText = totalQuantity;
        updateSummary(subtotal);
    };

    const updateSummary = (subtotal) => {
        let discount = 0;

        if (appliedPromoCode && promoCodes[appliedPromoCode]) {
            discount = (subtotal * promoCodes[appliedPromoCode]) / 100;
        }

        let total = subtotal - discount;

        document.getElementById('subtotalAmount').innerText = subtotal.toFixed(2);
        document.getElementById('discountAmount').innerText = discount.toFixed(2);
        document.getElementById('totalAmount').innerText = total.toFixed(2);
    };

    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let quantity = null;
        let positionProductInCart = cart.findIndex((item) => item.product_id == idProduct);

        switch (true) {
            case (buttonClick.classList.contains('addCart')):
                quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('minus')):
                quantity = cart[positionProductInCart].quantity - 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('plus')):
                quantity = cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;
            default:
                break;
        }
    });

    document.getElementById('applyPromoCodeButton').addEventListener('click', () => {
        const promoCodeInput = document.getElementById('promoCodeInput').value.trim();
        const messageElement = document.getElementById('promoCodeMessage');

        if (promoCodes[promoCodeInput]) {
            appliedPromoCode = promoCodeInput;
            messageElement.innerText = `Promo code "${promoCodeInput}" applied successfully!`;
            messageElement.style.color = 'green';
        } else {
            appliedPromoCode = null;
            messageElement.innerText = 'Invalid promo code. Please try again.';
            messageElement.style.color = 'red';
        }

        // Recalculate totals with the new promo code
        let subtotal = parseFloat(document.getElementById('subtotalAmount').innerText);
        updateSummary(subtotal);
    });

    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    };

    initApp();
};

export default cart;