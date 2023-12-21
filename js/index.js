const sideBarList = document.querySelector(".sidebar-list");

const init = () => {
    renderStores(Stores);
    const loupe = document.querySelector(".input-button__search");
    loupe.addEventListener("click", () => searchStores(Stores));
    
    const refreshStores = document.querySelector(".input-button__refresh");
    refreshStores.addEventListener("click", () => renderStores(Stores));
    
    const clearInput = document.querySelector(".input-button__clear");
    clearInput.addEventListener("click", () => {
        renderStores(Stores);
        input.value = '';
        clearInput.classList.add("js-hidden")
    });
    clearInput.classList.add("js-hidden")
    
    const input = document.querySelector(".sidebar-header__input");
    input.addEventListener("input", () => {
        refreshStores.classList.add("js-hidden");
        loupe.classList.add("input-button__search-active");
        clearInput.classList.remove("js-hidden");
    })

    sideBarList.addEventListener("click", ({target}) => {
        const choosedStore = target.closest(".sidebar-list__item");
        chooseActiveStore(choosedStore);
        renderStoreDetails(choosedStore);
        getCountOfProducts(choosedStore);
        renderTableHead(choosedStore);
        renderTableBody(choosedStore);
    })
}

const renderStores = (data) => {
    sideBarList.innerHTML = "";
    data.forEach(shop => {
        sideBarList.insertAdjacentHTML ("beforeend", `
        <li class="sidebar-list__item" id='${shop.id}'>
                <div class="store-info">
                    <p class="list-company">${shop.Name}</p>
                    <p class="list-square">${shop.FloorArea}</p>
                </div>
                <p class="list-address">${shop.Address}</p>
            </li>
        `)
    });
}

const chooseActiveStore = (choosedStore) => {
    const activeStore = document.querySelector(".js-store-active");
    if (activeStore) {
        activeStore.classList.remove("js-store-active");
    }
    choosedStore.classList.add("js-store-active");
    const defaultWrapper = document.querySelector(".wrapper");
    const storeDetails = document.querySelector(".details");
    defaultWrapper.classList.add("js-hidden");
    storeDetails.classList.remove("js-hidden");
}

const renderStoreDetails = (choosedStore) => {
    const currentStore = Stores.find(store => store.id === +choosedStore.id);
    const email = document.querySelector(".details-header__email");
    email.textContent = currentStore.Email;
    const phoneNumber = document.querySelector(".details-header__phone");
    phoneNumber.textContent = currentStore.PhoneNumber;
    const address = document.querySelector(".details-header__address");
    address.textContent = currentStore.Address;
    const establishedDate = document.querySelector(".details-header__date");
    console.log(currentStore.Established);
    const month=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec");  
    const date = new Date(currentStore.Established);
    establishedDate.textContent = month[date.getUTCMonth()]+ " " + date.getUTCDate()+ ", " + date.getUTCFullYear() ;
    const floorArea = document.querySelector(".details-header__square");
    floorArea.textContent = currentStore.FloorArea;
}

const renderTableHead = (choosedStore) => {
    const thead = document.querySelector(".details-body__table-thead");
    thead.innerHTML = "";
    const productHeaders = ["Name", "Price", "Specs", "SupplierInfo", "Country of origin","Prod.Company","Rating"];
    const headRow = document.createElement("tr");
    headRow.classList.add("details-body__table-titles");
    productHeaders.forEach(head => {
        const th = document.createElement("th");
        th.dataset.sort = head;
        th.textContent = head;
        headRow.appendChild(th);
    })
    thead.append(headRow);
}

const renderTableBody = (choosedStore) => {
    const currentStore = Stores.find(store => store.id === +choosedStore.id);
    const tbody = document.querySelector(".details-body__table-tbody");
    tbody.innerHTML = "";
    const productValuesKeys = ["Name", "Price", "Specs", "SupplierInfo", "MadeIn","ProductionCompanyName","Rating"];
    currentStore["rel_Products"].forEach(productItem => {
        const bodyRow = document.createElement("tr");
        productValuesKeys.forEach(keyOfProduct => {
            const td = document.createElement("td");
            switch(keyOfProduct){
                case "Price": 
                td.textContent = productItem[keyOfProduct] +" USD"
                break;
                case "Rating":
                    productItem[keyOfProduct]==1?td.innerHTML =`
                <div class="rating-stars">
                    <span class="active-star"></span>	
                    <span></span>    
                    <span></span>  
                    <span></span>    
                    <span></span>
                </div>`
                    :productItem[keyOfProduct]==2?td.innerHTML = `
                    <div class="rating-stars">
                    <span class="active-star"></span>	
                    <span class="active-star"></span>    
                    <span></span>  
                    <span></span>    
                    <span></span>
                </div>`
                    :productItem[keyOfProduct]==3?td.innerHTML = `
                    <div class="rating-stars">
                    <span class="active-star"></span>	
                    <span class="active-star""></span>    
                    <span class="active-star"></span>  
                    <span></span>    
                    <span></span>
                </div>`
                    :productItem[keyOfProduct]==4?td.innerHTML = `
                    <div class="rating-stars">
                    <span class="active-star"></span>	
                    <span class="active-star""></span>    
                    <span class="active-star"></span>  
                    <span class="active-star"></span>    
                    <span></span>
                </div>`
                    :td.innerHTML = `
                    <div class="rating-stars">
                    <span class="active-star"></span>	
                    <span class="active-star"></span>    
                    <span class="active-star"></span>  
                    <span class="active-star"></span>    
                    <span class="active-star"></span>
                </div>`
                break;
                default:
                td.textContent = productItem[keyOfProduct];
            }
            bodyRow.appendChild(td);
        })
        tbody.append(bodyRow);
    })
}

const getCountOfProducts = (choosedStore) => {
    const currentStore = Stores.find(store => store.id === +choosedStore.id);
    const allProducts = document.querySelector(".details-header__count-all");
    const okProducts = document.querySelector(".details-header__count-ok");
    const storageProducts = document.querySelector(".details-header__count-storage");
    const outOfStockProducts = document.querySelector(".details-header__count-absent");
    allProducts.textContent = currentStore.rel_Products.length;
    okProducts.textContent = currentStore.rel_Products.filter(productItem => productItem["Status"] === "OK").length;
    storageProducts.textContent = currentStore.rel_Products.filter(productItem => productItem["Status"] === "STORAGE").length;
    outOfStockProducts.textContent = currentStore.rel_Products.filter(productItem => productItem["Status"] === "OUT_OF_STOCK").length;
}

const searchStores = (data) => {
    const textFromInput = document.querySelector(".sidebar-header__input").value;
    const searchedStores = data.filter(({Name, Address, FloorArea}) => {
        return [Name, Address, FloorArea].some(elem => elem.toString().toLowerCase().includes(textFromInput.trim().toLowerCase()))
    })
console.log(searchedStores);
    if (searchedStores.length !== 0) {
        sideBarList.innerHTML = "";
        renderStores(searchedStores);
    } else {
        sideBarList.innerHTML = `
        <li class="sidebar-list__search-error">
        Your search did not return any results.
        </li>`
    }
}

document.addEventListener("DOMContentLoaded", function () {
    init();    
});