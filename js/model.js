/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model() {
    const storesListBody = document.querySelector('.stores-list__body');
    const createStoreForm = document.querySelector('.store-popup__form');

    /**
     * URL template for getting the stores from the server.
     * @type {string}
     *
     */
    const API_STORES = 'http://localhost:3000/api/Stores/';

    /**
     * URL template for getting the products from the server.
     * @type {string}
     *
     */
    const API_PRODUCTS = 'http://localhost:3000/api/Products/';

    function fetchData(url) {
        return fetch(url)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * Get the stores from the server by url.
     *
     * @returns {Object} with stores.
     *
     * @public
     */
    this.getStoresApi = function () {
        return fetchData(API_STORES);
    };

    /**
     * Get the store from the server by id.
     *
     * @param {number} storeId the store id.
     *
     * @returns {Object} with the store.
     *
     * @public
     */
    this.getStoreById = function (storeId) {
        const url = `${API_STORES}${storeId}`;
        return fetchData(url);
    };

    /**
     * Get the products of the selected store from the server by storeid and filtered it by product status.
     *
     * @param {number} storeId the store id.
     * @param {string} storeStatus the store status, default value = "all".
     *
     * @returns {Object} with the array of products.
     *
     * @public
     */
    this.getProductsApi = function (storeId, storeStatus = 'all') {
        if (storeStatus == 'all') {
            const url = `${API_STORES}${storeId}/rel_Products`;
            return fetchData(url);
        } else {
            const url = `${API_PRODUCTS}?filter={"where": {"and": [{"Status": "${storeStatus}"},{"StoreId": "${storeId}"}]}}`;
            return fetchData(url);
        }
    };

    /**
     * Get the products info of the selected product from the server by product id value.
     *
     * @param {number} productId the product id.
     *
     * @returns {Object} with product information.
     *
     * @public
     */
    this.getProductApi = function (productId) {
        const url = `${API_PRODUCTS}${productId}`;
        return fetchData(url);
    };

    /**
     * Get products depending on the section from the server by product id value and product status.
     *
     * @param {number} productId the product id.
     * @param {string} value the product status.
     *
     * @returns {Object} with product information.
     *
     * @public
     */
    this.getProductStatusApi = function (productId, value) {
        const url = `${API_STORES}${productId}/rel_Products?filter={"where":{"Status":"${value}"}}`;
        return fetchData(url);
    };

    /**
     * Delete the store from stores list
     * @param {number} activeStoreId the store id.
     *
     * @public
     */
    this.deleteStore = function (activeStoreId) {
        return fetch(`${API_STORES}${activeStoreId}`, {
            method: 'DELETE',
        });
    };

    /**
     * Delete all products from products list
     * @param {number} activeStoreId the store id.
     *
     * @public
     */
    this.deleteStoreProducts = function (activeStoreId) {
        return fetch(`${API_STORES}${activeStoreId}/rel_Products`, {
            method: 'DELETE',
        });
    };

    /**
     * Delete the product from products list
     * @param {number} productId the product id.
     *
     * @public
     */
    this.deleteStoreProduct = function (productId) {
        return fetch(`${API_PRODUCTS}${productId}`, {
            method: 'DELETE',
        });
    };

    /**
     * Search the store by input text
     * @param {string} input is the seatch input value
     *
     * @returns {Object} with all stores that matches with input in name, address or floor area.
     *
     * @public
     */
    this.searchStore = function (input) {
        storesListBody.innerHTML = '';
        const url = `http://localhost:3000/api/Stores?filter={"where":{"or":[{"Name":{"ilike":"${input}"}},{"Address":{"ilike":"${input}"}},{"FloorArea":{"ilike":"${input}"}}]}}`;
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    storesListBody.innerHTML = `<li class="sidebar-list__search-error">Your search did not return any results.</li>`;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /**
     * Search the product by input text
     * @param {string} input is the seatch input value
     * @param {number} activeStoreId is the selected store id
     *
     * @returns {Object} with all stores that matches with input in name, address or floor area.
     *
     * @public
     */
    this.searchProducts = function (input, activeStoreId) {
        const detailsTableBody = document.querySelector('.details-body__table-tbody');
        const url = `http://localhost:3000/api/Products?filter={"where":{"or":[{"Name":{"ilike":"${input}"}},{"Price":{"ilike":"${input}"}},{"Specs":{"ilike":"${input}"}},{"SupplierInfo":{"ilike":"${input}"}},{"MadeIn":{"ilike":"${input}"}},{"ProductionCompanyName":{"ilike":"${input}"}}],"StoreId":"${activeStoreId}"},"order":"Specs Asc"}`;
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    detailsTableBody.innerHTML = `<li class="sidebar-list__search-error">Your search did not return any results.</li>`;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /**
     * Create a new store with the entering params
     *
     * @returns {Object} a new store
     *
     * @public
     */
    this.addStoreApi = function () {
        const Name = createStoreForm.querySelector('.store-popup__name').value;
        const Email = createStoreForm.querySelector('.store-popup__email').value;
        const PhoneNumber = createStoreForm.querySelector('.store-popup__phone').value;
        const Address = createStoreForm.querySelector('.store-popup__address').value;
        const Established = createStoreForm.querySelector('.store-popup__date').value;
        const FloorArea = createStoreForm.querySelector('.store-popup__square').value;

        const store = { Name, Email, PhoneNumber, Address, Established, FloorArea };
        createStoreForm.reset();

        return fetch(API_STORES, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(store),
        });
    };

    /**
     * Create a new product with the entering params
     *
     * @param {number} activeStoreId is the selected store id
     * @param {Object} object is a new product object
     *
     * @returns {Object} a new product
     *
     * @public
     */
    this.addProductApi = function (activeStoreId, object) {
        return fetch(`${API_STORES}${activeStoreId}/rel_Products`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(object),
        });
    };

    /**
     * Edit information about concrete product
     *
     * @param {number} activeProductId is thw selected product id
     * @param {Object} obj is the modified product object
     *
     * @returns {Object} the product with new params
     *
     * @public
     */
    this.editProduct = function (activeProductId, obj) {
        return fetch(`http://localhost:3000/api/Products/${activeProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(obj),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /**
     * Filter products of the selected store by status
     *
     * @param {String} activeListItem is the selected product status
     * @param {number} activeStoreId is the selected store is
     *
     * @returns {Object} with all products which have selected product status
     *
     * @public
     */
    this.filterProducts = function (activeListItem, activeStoreId) {
        return this.getProducts(activeStoreId, activeListItem.id);
    };

    /**
     * Delete selected store from the server database
     *
     * @param {String} activeStoreId is the selected store id
     *
     * @public
     */
    this.deleteStore = function (activeStoreId) {
        return fetch(`${API_STORES}${activeStoreId}`, {
            method: 'DELETE',
        });
    };
}

export default Model;
