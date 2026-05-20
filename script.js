let cart = [];
const products = { labels: [] };

// 1. توليد الاستيكرات
for (let i = 1; i <= 42; i++) {
    products.labels.push({
        id: i,
        name: `Sticker ${i}`,
        price: 20,
        img: `stickers/image${i}.jpg` 
    });
}

// 2. تفعيل EmailJS باستخدام الـ Public Key (من صورة Account)
(function() {
    emailjs.init("Nlnk5PAJFTGzPSZbK"); //
})();

function navigateTo(category) {
    document.getElementById('home-grid').classList.add('hidden');
    document.getElementById('product-page').classList.remove('hidden');
    const content = document.getElementById('page-content');

    if (category === 'labels') {
        content.innerHTML = `<div class="product-grid">
            ${products.labels.map(p => `
                <div class="product-card">
                    <div class="img-container">
                        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                    </div>
                    <h3>${p.name}</h3>
                    <p class="price">${p.price} EGP</p>
                    <button class="buy-btn" onclick="addToCart(${p.id})">Buy Now</button>
                </div>
            `).join('')}
        </div>`;
    }
}

function addToCart(id) {
    const product = products.labels.find(p => p.id === id);
    if(product) {
        cart.push(product);
        updateCartUI();
        showCheckoutForm(); 
    }
}

function updateCartUI() {
    const countElem = document.getElementById('cart-count');
    if(countElem) countElem.innerText = cart.length;
}

function showCheckoutForm() {
    if (cart.length === 0) return alert("السلة فارغة!");
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.add('active');
}

function hideCheckoutForm() {
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.remove('active');
}

function goHome() {
    document.getElementById('home-grid').classList.remove('hidden');
    document.getElementById('product-page').classList.add('hidden');
}

// 3. الإرسال الفعلي بالبيانات اللي نجحت في الصور
document.getElementById('order-form').onsubmit = function(e) {
    e.preventDefault();

    const details = cart.map(p => p.name).join(' , ');
    const total = cart.reduce((sum, p) => sum + p.price, 0);

    const templateParams = {
        user_name: document.getElementById('user-name').value,
        user_phone: document.getElementById('user-phone').value,
        user_address: document.getElementById('user-address').value,
        order_details: details,
        total_price: total + " EGP"
    };

    // تم التحديث لـ service_381sf4d (الناجحة في صورة الـ History والجيميل)
    // و template_e20euif (من صورة الـ Templates)
    emailjs.send('service_381sf4d', 'template_e20euif', templateParams)
        .then(function(response) {
            alert(`مبروك يا ${templateParams.user_name}! الطلب وصلني بنجاح.`);
            cart = [];
            updateCartUI();
            hideCheckoutForm();
        }, function(error) {
            alert("للأسف حصل مشكلة، حاولي تاني.");
            console.error("EmailJS Error:", error);
        });
};