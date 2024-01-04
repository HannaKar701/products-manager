/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View(currentStore) {

    var currentStore;
    const storesListBody = document.querySelector(".stores-list__body");
    const email = document.querySelector(".details-header__email");
    const address = document.querySelector(".details-header__address");
    const phoneNumber = document.querySelector(".details-header__phone");
    const establishedDate = document.querySelector(".details-header__date");
    const month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
    const floorArea = document.querySelector(".details-header__square");
    const tableHeader = document.querySelector(".details-body__table-thead");
    const tableColumnsName = ["Name", "Price", "Specs", "SupplierInfo", "Country of origin","Prod.Company","Rating",""];
    const productValuesKeys = ["Name", "Price", "Specs", "SupplierInfo", "MadeIn","ProductionCompanyName","Rating", "Actions"];
    const maxRating = 5;
    const tbody = document.querySelector(".details-body__table-tbody");
    const allProductsNum = document.querySelector(".details-header__count-all");
    const okProductsNum = document.querySelector(".details-header__count-ok");
    const storageProductsNum = document.querySelector(".details-header__count-storage");
    const outOfStockProductsNum = document.querySelector(".details-header__count-absent");
    const detailsTableBody = document.querySelector(".details-body__table-tbody");
    const editProductForm = document.querySelector(".edit-product__form")
    const editProductName = document.querySelector(".edit-product__name");
    const editProductPrice = document.querySelector(".edit-product__price");
    const editProductSpecs = document.querySelector(".edit-product__specs");
    const editProductRating = document.querySelector(".edit-product__rating");
    const editProductSupplier = document.querySelector(".edit-product__info");
    const editProductMadeIn = document.querySelector(".edit-product__origin");
    const editProductProductionCompany = document.querySelector(".edit-product__company-name");
    const editProductStatusOptions = document.querySelectorAll(".edit-option-js");

    /**
     * Render stores in store list section
     *
     * @param {Object} stores object stores
     * 
     * @public
     */
    this.renderStores = function(stores) {
        if(typeof stores === "undefined"){
            detailsTableBody.innerHTML = `
                    <li class="sidebar-list__search-error">
                        Your search did not return any results.
                    </li>`
        }else{
            storesListBody.innerHTML = "";
        }
        stores.forEach(store => {
            storesListBody.insertAdjacentHTML ("beforeend", `
                <li class='stores-list__body-item ${store.id === +currentStore?.id && "js-store-active"}' id='${store.id}'>
                        <div class="stores-list__store-info">
                            <p class="list-company">${store.Name}</p>
                            <p class="list-square">${store.FloorArea}</p>
                        </div>
                        <p class="list-address">${store.Address}</p>
                </li>`
            );
        });
    };

    /**
     * Choose active store in store list section
     *
     * @param {Object} store the selected store
     * 
     * @public
     */
    this.chooseActiveStore = function(store) {
        const defaultWrapper = document.querySelector(".wrapper");
        const storeDetails = document.querySelector(".details");
        const storeDetailsFooter = document.querySelector(".details-footer");
        const activeStore = document.querySelector(".js-store-active");
        
        if (activeStore) {
            activeStore.classList.remove("js-store-active");
            document.querySelector(".details-body__input").value = "";
        };
        store.classList.add("js-store-active");
        defaultWrapper.classList.add("js-hidden");
        storeDetails.classList.remove("js-hidden");
        storeDetailsFooter.classList.remove("js-hidden");
        currentStore = store;
    };

    /**
     * Render store address section by filling the information of the selected store
     *
     * @param {Object} store the selected store
     * 
     * @public
     */
    this.renderStoreDetails = async function (store) {
        email.textContent = store.Email;
        phoneNumber.textContent = store.PhoneNumber;
        address.textContent = store.Address;
        const date = new Date(store.Established);
        establishedDate.textContent = month[date.getUTCMonth()]+ " " + date.getUTCDate()+ ", " + date.getUTCFullYear();
        floorArea.textContent = store.FloorArea;
    };

    /**
     * Render table head
     * 
     * @public
     */
    this.renderTableHead = function(){
        tableHeader.innerHTML = "";
        const headRow = document.createElement("tr");
        headRow.classList.add("details-body__table-titles");
        tableColumnsName.forEach(tableColumn => {
            const th = document.createElement("th");
            th.dataset.sort = tableColumn;
            th.innerHTML = `
                <div class="details-body__table-title">
                    <button class="details-body__sort-button"></button>
                    <p>${tableColumn}</p>
                </div>`;
            headRow.appendChild(th);
        });
        tableHeader.append(headRow);
        detailsTableTitles = headRow;
        sortButton = document.querySelector(".details-body__sort-button");
    };

    /**
     * Render product table by iterating over the products array
     *
     * @param {Object} products array of products of the selected store
     * 
     * @public
     */
    this.renderTableBody = function(products){
        if(typeof products === "undefined"){
            detailsTableBody.innerHTML = `
                    <li class="sidebar-list__search-error">
                        Your search did not return any results.
                    </li>`
        }
        tbody.innerHTML = "";
        products.forEach(productItem => {
            const bodyRow = document.createElement("tr");
            productValuesKeys.forEach(keyOfProduct => {
                const td = document.createElement("td");
                switch(keyOfProduct){
                    case "Price": 
                        td.textContent = productItem[keyOfProduct] +" USD"
                        break;
                    case "Rating":
                        td.innerHTML = 
                        `<div class="rating-stars">`+
                            `<span class="active-star"></span>`.repeat(productItem[keyOfProduct])+
                            `<span></span>`.repeat(maxRating-productItem[keyOfProduct])+
                        `</div>`
                        break;
                    case "Actions":
                        td.innerHTML = `
                        <div class ="product-buttons" id=${productItem["id"]}>
                            <img class="product-button__edit" src="img/edit-product.svg" alt="product-more">
                            <img class="product-button__delete" src="img/delete-product.svg" alt="product-delete">
                        </div>
                        `
                        break;
                    default:
                        td.textContent = productItem[keyOfProduct];
                }
                bodyRow.appendChild(td);
            });
            tbody.append(bodyRow);
        });
    };

    /**
     * Render product statuses section by filling the information about product statuses of the 
     * selected store
     *
     * @param {Object} products array of products of the selected store
     * 
     * @public
     */
    this.getCountOfProducts = function (products){       
        allProductsNum.textContent = products.length;
        okProductsNum.textContent = products.filter(productItem => productItem["Status"] === "OK").length;
        storageProductsNum.textContent = products.filter(productItem => productItem["Status"] === "STORAGE").length;
        outOfStockProductsNum.textContent = products.filter(productItem => productItem["Status"] === "OUT_OF_STOCK").length;
    };

    /**
    * Filling the edit popup with selected product information
    *
    * @param {Object} product selected store product
    * 
    * @public
    */
    this.fillEditProductPopup = function (product) {
    editProductForm.setAttribute("data-product-id", product.id);
    editProductName.value = product.Name; 
    editProductPrice.value = product.Price;
    editProductSpecs.innerHTML = product.Specs;
    editProductRating.value = product.Rating;
    editProductSupplier.innerHTML = product.SupplierInfo;
    editProductMadeIn.value = product.MadeIn;
    editProductProductionCompany.value = product.ProductionCompanyName;
    editProductStatusOptions.forEach (option => {
        if (option.value === product.Status) {
            option.setAttribute("selected","selected");
        }
    })
}

    /**
    * Validate creating store form
    *
    * @param {Object[]} fields all inputs from the selected form
    * @returns {Boolean} which show are all form input was filled or not 
    * 
    * @public
    */
    this.validateRequiredFields = function(fields) {
        let isValid = true;
        fields.forEach((field) => {
            if(field.value === '') { 
                field.classList.add('invalid')
                if(isValid) {
                    isValid = false
                }; 
            }else{
                field.classList.remove('invalid')
            }
        });
        return isValid
    }

}