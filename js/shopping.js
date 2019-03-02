class Product {
        constructor(data) {
                this._artnr = data.artnr;
                if (this._artnr === undefined) {
                        throw "Article number is mandatory for products";
                }
                this._title = data.title;
                if (this._title === undefined) {
                        throw "Title is mandatory for products";
                }
                this._stock = parseInt(data.stock);
                if (this._stock < 0) {
                        throw "Invalid stock value";
                }
                this._description = data.description || "";
                this._price = data.price || 0;
                this._img = data.img;
                this._li = null;
        }

        updateImg() {
                if (this._li === null) {
                        this.getDOM();
                }
                this._li.querySelector('.shop_product__image').src = `https://raw.githubusercontent.com/Sinf4er/Animation-Scripting/master/assets/pic/sneaker/${this.img}`;
        }

        updateTpl() {
                if (this._li === null) {
                        this.getDOM();
                }
                this._li.querySelector('.shop_product__title').textContent = this._title;
                this._li.querySelector('.shop_product__image').src = `https://raw.githubusercontent.com/Sinf4er/Animation-Scripting/master/assets/pic/sneaker/${this.img}`;
                this._li.querySelector('.shop_product__price').textContent = this.priceFormatted;
                const stock = this._li.querySelector('.shop_product__stock');
                stock.classList.remove('shop_product__stock--in');
                stock.classList.remove('shop_product__stock--out');

                if (this.isInStock()) {
                        stock.textContent = 'Verfügbar';
                        stock.classList.add('shop_product__stock--in');
                } else {
                        stock.textContent = 'Nicht lagernd!';
                        stock.classList.add('shop_product__stock--out');
                }
        }
        getPrice() {
                return this._price;
        }
        get img() {
                return this._img;
        }
        get price() {
                return this.getPrice();
        }
        get priceFormatted() {
                return `€ ${this.price.toFixed(2)}`;
        }
        get title() {
                return this._title;
        }
        getSelectedAmount() {
                return parseInt(this._li.querySelector('.shop_product__amount').value);
        }
        isInStock(order_quantity = this.getSelectedAmount()) {
                return this._stock - order_quantity >= 0;
        }
        getArtNr() {
                return this._artnr;
        }
        getDOM() {
                if (this._li === null) {
                        this._li = document.createElement('li');
                        this._li.classList.add('cart');
                        this._li.innerHTML = `<img src="assets/pic/sneaker/adidas-originals-sneaker-weiss-598555.jpg" class="shop_product__image">
                                                        <div class="shop_product__info_cnt">
                                                                <div class="information">
                                                                        <h3 class="shop_product__title"></h3>
                                                                        <div class="shop_product__price"></div>
                                                                </div>
								
                                                                <div class="shop_product__add_cnt">
                                                                        <div class="information">
                                                                                <ul class="shop_product__dimentions"></ul>
                                                                                <input type="text" class="shop_product__amount" value="1"><div class="shop_product__stock shop_product__stock--in"></div>
                                                                        </div>
									<div class="shop_product__add"> ADD
									<img src="assets/pic/add-to-the-cart.svg" alt="cart" class="img">
									</div>
                                                                </div>
                                                        </div>`;
                }
                this._li.querySelector('.shop_product__amount').addEventListener('keyup', () => {
                        this.updateTpl();
                });

                this._li.querySelector('.shop_product__add').addEventListener('click', (e) => {

                        let basketItem = new BasketItem(this.getSelectedAmount(), this.getArtNr(), this);
                        window.basket.addItem(basketItem);

                        setTimeout(function () {
                                let counter = document.querySelector('.shop_cart__btn_count')
                                setTimeout(function () {
                                        counter.classList.remove('green_animation');
                                }, 800);
                                counter.classList.add('green_animation');
                        }, 600);

                        let img = this._li.querySelector('.shop_product__image');
                        let tl = new TimelineLite();
                        tl.to(img, .1, { borderRadius: "150px", zIndex: -2 })
                                .to(img, .2, { width: "30px", top: "260px", left: "262px" }, "+=.1")
                                .to(img, .2, { top: "421px" })
                                .to(img, .1, { opacity: "0" })
                                .to(img, .1, { width: "300px", top: "0px", left: "0px", borderRadius: "0px" })
                                .to(img, .1, { opacity: "1" })
                });

                this.updateTpl();
                return this._li;
        }
}

/***********************************************************
		*
		*	Erweiterte Produkte Klasse
		*	Für Produkte in unerschiedlichen Ausprägungen
		*/

class ComplexProduct extends Product {
        constructor(data) {
                super(data);
                this._stock = new Map(data.stock);
                this._dimentions = [];
                this._dimentions_img = new Map(data.dimentions_img);
                for (const dim_data of data.dimentions) {
                        let dim;
                        if (dim_data.type === "color") {
                                dim = new ColorDimention(dim_data);
                        } else {
                                dim = new Dimentions(dim_data);
                        }
                        dim.onChange(() => {
                                this.updateTpl();
                        });
                        this._dimentions.push(dim);
                }

        }
        getDOM() {
                super.getDOM();
                for (const dim of this._dimentions) {
                        this._li.querySelector('.shop_product__dimentions').appendChild(dim.getDOM());
                }
                return this._li;
        }

        isInStock(order_quantity = this.getSelectedAmount(), nr = this.getArtNr()) {
                let stock = 0;
                if (this._stock.has(nr)) {
                        return this._stock.get(nr) - order_quantity >= 0;
                }
                return false;
        }

        getArtNr() {
                let artnr = this._artnr;
                for (const dim of this._dimentions) {
                        artnr += '-' + dim.getNr();
                }
                return artnr;
        }

        getPrice(artnr) {
                let price = super.getPrice();
                for (const dim of this._dimentions) {
                        price += dim.getAdd_price(artnr);
                }
                return price;
        }
        get price() {
                return this.getPrice();
        }

        get img() {
                let nr = this.getArtNr();
                let img = "";
                for (const img_data of this._dimentions_img.entries()) {
                        let [imgname, artnrs] = img_data;
                        artnrs = new Set(artnrs);
                        if (artnrs.has(nr)) {
                                return imgname;
                        }
                }

                return this._img;
        }

}


/***********************************************************
*
*	Ausprägungdimension für ComplexProduct 
*	Basisklasse für Produktdimensionen wie Größe, Länge ect. mit Dropdown
*/


class Dimentions {
        constructor(data) {
                this._code = data.code;
                this._label = data.label;
                this._type = data.type;
                this._values = new Map(data.values);
                this._li = null;
                this._cb = [];
                this.getDOM();
        }
        fireChage() {
                for (const cb of this._cb) {
                        cb();
                }
        }
        onChange(cb) {
                this._cb.push(cb);
        }
        getDOM() {
                if (this._li === null) {
                        const li = document.createElement('li');
                        li.classList.add('shop_product__dimentions_generic');
                        let s = document.createElement('select');
                        s.classList.add('shop_product__dimentions_select');
                        for (const n of this._values.entries()) {
                                const [key, value] = n;
                                const o = document.createElement('option');
                                o.setAttribute('value', key);
                                o.textContent = value.label;
                                o.setAttribute('data-add-price', value.add_price);
                                o.setAttribute('data-nr', this._code + key);
                                s.appendChild(o);
                        }
                        s.addEventListener('change', () => {
                                this.fireChage();
                        });
                        li.appendChild(s);
                        this._li = li;
                }
                return this._li;
        }
        getNr() {
                let idx = this._li.querySelector('.shop_product__dimentions_select').selectedIndex;
                let nr = this._li.querySelector('.shop_product__dimentions_select').options[idx].getAttribute('data-nr');
                return nr;
        }
        get add_price() {
                return this.getAdd_price();
        }
        getAdd_price(artnr) {
                if (artnr === undefined) {
                        let idx = this._li.querySelector('.shop_product__dimentions_select').selectedIndex;
                        let price = this._li.querySelector('.shop_product__dimentions_select').options[idx].getAttribute('data-add-price');
                        return parseFloat(price);
                } else {
                        //parse Articlenumber for Dimention code
                        const parsed_option = (new RegExp(`-${this._code}([^-]+)`)).exec(artnr);
                        if (parsed_option && parsed_option[1].length > 0) {
                                const value = this._values.get(parsed_option[1]);
                                if (value) {
                                        return value.add_price;
                                } else {
                                        throw "Articlenumber contains invalid dimention value";
                                }
                        } else {
                                throw "Articlenumber dosent contain matching Dimention Expression";
                        }
                }
        }
}


/***********************************************************
*
*	Klasse für den Warenkorb
*/


class Basket {
        constructor() {
                this._items = new Map();
                this._div = null;
        }
        get sum() {
                let sum = 0;
                for (const [artnr, item] of this._items) {
                        sum += item.price;
                }
                return sum;
        }
        addItem(item) {
                if (this._items.has(item.getArtNr())) {
                        let basketItem = this._items.get(item.getArtNr());
                        basketItem.amount = basketItem.amount + item.amount;
                } else {
                        this._items.set(item.getArtNr(), item);
                }
                this.updateTpl();
                item.onAmountChanged(() => {
                        for (const [artnr, item] of this._items) {
                                if (item.amount === 0) {
                                        this.removeItem(artnr);
                                }
                        }
                        this.updateTpl();
                });
        }
        removeItem(artnr) {
                this._items.delete(artnr);
                this.updateTpl();
        }
        updateTpl() {
                const tpl = this._div;
                tpl.querySelector('.shop_cart__btn_count').textContent = this._items.size;
                const cart_list = tpl.querySelector('.shop_cart__list');
                cart_list.innerHTML = '';
                for (const [key, item] of this._items) {
                        const item_dom = item.getDOM();
                        cart_list.appendChild(item_dom);
                }
                tpl.querySelector('.shop_cart__total_sum').textContent = `€ ${this.sum.toFixed(2)}`;
        }
        open() {
                this._div.classList.replace('shop_cart--closed', 'shop_cart--open');

        }
        close() {
                this._div.classList.replace('shop_cart--open', 'shop_cart--closed');

        }
        isOpen() {
                return this._div.classList.contains('shop_cart--open');
        }
        getDOM() {
                if (this._div !== null) {
                        return this._div;
                }
                const div = document.createElement('div');
                div.classList.add('shop_cart');
                div.classList.add('shop_cart--closed');
                div.innerHTML =
                        `<div class="shop_cart__btn">
                                                                <i class="material-icons prefix">shopping_cart</i>
                                                                <span class="shop_cart__btn_count">0</span>
                                                        </div>
                                                        <div class="shop_cart__cnt">
                                                                <div class="shop_cart__wrapper">
                                                                        <h3>Warenkorb</h3><i class="material-icons prefix shop_cart__close_btn">clear</i>
                                                                        <ul class="shop_cart__list"></ul>
                                                                        <div class="shop_cart__order">
                                                                                <div class="shop_cart__total_sum"></div>
                                                                                <button class="shop_cart__order_btn">Bestellen</button>
                                                                                
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div class="shop_cart__closer"></div>`;
                div.querySelector('.shop_cart__btn').addEventListener('click', () => {
                        if (this.isOpen()) {
                                this.close();
                        } else {
                                this.open();
                        }
                });
                div.querySelector('.shop_cart__close_btn').addEventListener('click', () => {
                        this.close();
                });
                div.querySelector('.shop_cart__closer').addEventListener('click', () => {
                        this.close();
                });
                this._div = div;
                this.updateTpl();
                return this._div;

        }
}

/***********************************************************
*
*	Klasse für ein Item im Warenkorb
*/


class BasketItem {
        constructor(amount, artnr, product) {
                this._img = product.img;
                this._amount = amount;
                this._artnr = artnr;
                this._product = product;
                this._li = null;
                this._onAmountChangesCallbacks = [];
        }
        getArtNr() {
                return this._artnr;
        }
        get amount() {
                return this._amount;
        }
        get img() {
                return this._img;
        }
        set amount(amount) {
                this._amount = amount;
                this.fireAmountChanged();
        }
        get price() {
                let price = this._product.getPrice(this._artnr);
                price *= this._amount;
                return price;
        }
        onAmountChanged(fn) {
                this._onAmountChangesCallbacks.push(fn);
        }
        fireAmountChanged() {
                for (const fn of this._onAmountChangesCallbacks) {
                        fn();
                }
        }
        updateTpl() {
                if (this._li === null) this.getDOM();
                let li = this._li;
                li.querySelector('.shop_product__image_cart').src = `https://raw.githubusercontent.com/Sinf4er/Animation-Scripting/master/assets/pic/sneaker/${this.img}`;
                li.querySelector('.shop_cart__item_count').value = this._amount;
                li.querySelector('.shop_cart__item_name').textContent = this._product.title;
                li.querySelector('.shop_cart__item_nr').textContent = this._artnr;
                li.querySelector('.shop_cart__item_price').textContent = `€ ${this.price.toFixed(2)}`;
                const stock_display = li.querySelector('.shop_cart__item_stock');
                if (this._product.isInStock(this._amount, this._artnr)) {
                        stock_display.textContent = 'Lieferung in 1-3 Werktagen';
                        stock_display.classList.remove('shop_cart__item_stock--outofstock');
                } else {
                        stock_display.textContent = 'Nicht lagernd! Früheste Lieferung in 7 Werktagen!';
                        stock_display.classList.add('shop_cart__item_stock--outofstock');
                }

        }
        getDOM() {
                if (this._li === null) {
                        this._li = document.createElement('li');
                        this._li.classList.add('shop_cart__item');
                        this._li.innerHTML = `
                                                <div class="shop_cart__item_display">
                                                        <img src="assets/pic/sneaker/adidas-originals-sneaker-weiss-598555.jpg" class="shop_product__image_cart">
                                                        <input type="text" class="shop_cart__item_count" value=""></input>
                                                        <div class="shop_cart__item_info">
                                                                <span class="shop_cart__item_name"></span>
                                                                <div class="shop_cart__item_nr"></div>
                                                                <div class="shop_cart__item_stock"></div>
                                                        </div>
                                                </div>
                                                <i class=" shop_cart__item_remove material-icons ">delete</i>
                                                <div class="shop_cart__item_info_preis">
                                                        <div class="shop_cart__item_price"></div>
                                                </div>
                                        </li>`;
                        this._li.querySelector('.shop_cart__item_count').addEventListener('change', (e) => {
                                const new_amount = parseInt(e.target.value, 10);
                                if (new_amount > -1 && this._amount !== new_amount) {
                                        this.amount = new_amount;
                                }
                                this.updateTpl();
                        });

                        this._li.querySelector('.shop_cart__item_remove').addEventListener('click', (e) => {
                                this._li.addEventListener('animationend', () => {
                                        this.amount = 0;
                                });
                                this._li.classList.add('delete_animation');
                        });
                }
                this.updateTpl();
                return this._li;
        }
}

const init_shop = function (product_data) {
        for (const p of product_data) {
                let product;
                if (p.dimentions && p.dimentions.length > 0) {
                        product = new ComplexProduct(p);
                } else {
                        product = new Product(p);
                }

                document.querySelector('.shop_product_list__list').appendChild(product.getDOM());
        }

        window.basket = new Basket();
        document.querySelector('.shop_cart__component_cnt').appendChild(basket.getDOM());
        //basket.open();
};

fetch('https://raw.githubusercontent.com/Sinf4er/Animation-Scripting/master/products.json', {
        cache: "no-cache"
})
        .then(resp => resp.json())
        .then(data => {
                init_shop(data);
        }).catch(err => console.log(err));
