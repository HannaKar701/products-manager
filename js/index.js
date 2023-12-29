async function serverAddStore(obj){
    let response = await fetch('http://localhost:3000/api/Stores', {
        method: "POST",
        headers: {"Content-Type": "application/json", 
    "Accept": "application/json"},
        body: JSON.stringify(obj),
    })

    let data = await response.json();
    return data
}

async function serverGetStores(){
    let response = await fetch('http://localhost:3000/api/Stores', {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })

    let data = await response.json();
    return data
}

async function serverGetProducts(id){
    let response = await fetch(`http://localhost:3000/api/Stores/${id}/rel_Products`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })

    let data = await response.json();
    return data
}

async function serverGetProductStatus(id, value){
    let response = await fetch(`http://localhost:3000/api/Stores/${id}/rel_Products?filter={"where":{"Status":"${value}"}}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })

    let data = await response.json();
    return data
}

async function serverAddProduct(id, obj){
    let response = await fetch(`http://localhost:3000/api/Stores/${id}/rel_Products`, {
        method: "POST",
        headers: {"Content-Type": "application/json", 
    "Accept": "application/json"},
        body: JSON.stringify(obj),
    })

    let data = await response.json();
    return data
}

async function deleteStore(id){
    let response = await fetch(`http://localhost:3000/api/Stores/${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    })

    let data = await response.json();
    return data
}

async function deleteStoreProducts(id){
    let response = await fetch(`http://localhost:3000/api/Stores/${id}/rel_Products`, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    })

    let data = await response.json();
    return data
}

async function deleteStoreProduct(id){
    let response = await fetch(`http://localhost:3000/api/Products/${id}`, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    })

    let data = await response.json();
    return data
}

async function serverFilterStores(str){
    let response = await fetch(`http://localhost:3000/api/Stores?filter={"where":{"or":[{"Name":{"ilike":"${str}"}},{"Address":{"ilike":"${str}"}},{"FloorArea":{"ilike":"${str}"}}]}}`, {
        method: "GET",
        headers: {"Accept": "application/json"}
    })

    let data = await response.json();
    return data
}

async function serverFilterProducts(str,id){
    let response = await fetch(`http://localhost:3000/api/Products?filter={"where":{"or":[{"Name":{"ilike":"${str}"}},{"Price":{"ilike":"${str}"}},{"Specs":{"ilike":"${str}"}},{"SupplierInfo":{"ilike":"${str}"}},{"MadeIn":{"ilike":"${str}"}},{"ProductionCompanyName":{"ilike":"${str}"}}],"StoreId":"${id}"},"order":"Specs Asc"}`, {
        method: "GET",
        headers: {"Accept": "application/json"}
    })

    let data = await response.json();
    return data
}

const sideBarList = document.querySelector(".stores-list__body");
let currentStore;
let currentProduct;
let detailsTableTitles;
let sortButton;

async function init (){
    const serverDataStores = await serverGetStores();
    renderStores(serverDataStores);
    const storeLoupe = document.querySelector(".input-button__search");
    storeLoupe.addEventListener("click", () => searchStores());
    const productLoupe = document.querySelector(".details-body__input-search");
    productLoupe.addEventListener("click", () => searchProducts());
    
    const refreshStores = document.querySelector(".input-button__refresh");
    refreshStores.addEventListener("click", () => renderStores(serverDataStores));
    
    const clearInput = document.querySelector(".input-button__clear");
    clearInput.addEventListener("click", () => {
        renderStores(serverDataStores);
        input.value = '';
        clearInput.classList.add("js-hidden")
    });
    clearInput.classList.add("js-hidden")
    
    const input = document.querySelector(".stores-list__header-input");
    input.addEventListener("input", () => {
        refreshStores.classList.add("js-hidden");
        storeLoupe.classList.add("input-button__search-active");
        clearInput.classList.remove("js-hidden");
    })

    sideBarList.addEventListener("click", ({target}) => {
        const choosedStore = target.closest(".stores-list__body-item");
        currentStore = choosedStore;
            chooseActiveStore(choosedStore);
            renderStoreDetails(choosedStore);
            getCountOfProducts(choosedStore);
            renderTableHead(choosedStore);
            renderTableBodyAll(choosedStore);
            renderProductCategory(choosedStore);
    })

    const clearProductInput = document.querySelector(".details-body__input-clear");
    clearProductInput.addEventListener("click", () => {
        renderTableBodyAll(currentStore);
        ProductInput.value = '';
        clearProductInput.style.display = "none";
        productLoupe.classList.remove("details-body__search-active");
        productLoupe.classList.add("details-body__input-search");
    });
    
    const ProductInput = document.querySelector(".details-body__input");
    ProductInput.addEventListener("input", () => {
        clearProductInput.style.display = "block";
        productLoupe.classList.add("details-body__search-active");
    })
}

const renderStores = (data) => {
    sideBarList.innerHTML = "";
    data.forEach(shop => {
        sideBarList.insertAdjacentHTML ("beforeend", `
        <li class="stores-list__body-item" id='${shop.id}'>
                <div class="stores-list__store-info">
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
    const storeDetailsFooter = document.querySelector(".details-footer")
    defaultWrapper.classList.add("js-hidden");
    storeDetails.classList.remove("js-hidden");
    storeDetailsFooter.classList.remove("js-hidden");
}

async function renderStoreDetails (choosedStore) {
    const serverDataStores = await serverGetStores();
    const currentStore = serverDataStores.find(store => store.id === +choosedStore.id);
    const email = document.querySelector(".details-header__email");
    email.textContent = currentStore.Email;
    const phoneNumber = document.querySelector(".details-header__phone");
    phoneNumber.textContent = currentStore.PhoneNumber;
    const address = document.querySelector(".details-header__address");
    address.textContent = currentStore.Address;
    const establishedDate = document.querySelector(".details-header__date");
    const month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec"];  
    const date = new Date(currentStore.Established);
    establishedDate.textContent = month[date.getUTCMonth()]+ " " + date.getUTCDate()+ ", " + date.getUTCFullYear() ;
    const floorArea = document.querySelector(".details-header__square");
    floorArea.textContent = currentStore.FloorArea;
}

const renderTableHead = () => {
    const  tableHeader = document.querySelector(".details-body__table-thead");
    tableHeader.innerHTML = "";
    const tableColumnsName = ["Name", "Price", "Specs", "SupplierInfo", "Country of origin","Prod.Company","Rating",""];
    const headRow = document.createElement("tr");
    headRow.classList.add("details-body__table-titles");
    tableColumnsName.forEach(tableColumn => {
        const th = document.createElement("th");
        th.dataset.sort = tableColumn;
        th.innerHTML = `
        <div class="details-body__table-title">
        <button class="details-body__sort-button"></button>
        <p>${tableColumn}</p>
        </div>
        `;
        headRow.appendChild(th);
    })
    tableHeader.append(headRow);
    detailsTableTitles = headRow;
    sortButton = document.querySelector(".details-body__sort-button");
}

async function renderTableBodyAll (choosedStore){
    const serverDataProducts = await serverGetProducts(+choosedStore.id);
    renderTableBody(serverDataProducts);
}

async function renderTableBody(data){
const store = await data;
const tbody = document.querySelector(".details-body__table-tbody");
tbody.innerHTML = "";
const productValuesKeys = ["Name", "Price", "Specs", "SupplierInfo", "MadeIn","ProductionCompanyName","Rating", "Actions"];
store.forEach(productItem => {
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
                    `<span></span>`.repeat(5-productItem[keyOfProduct])+
                `</div>`
            break;
            case "Actions":
                td.innerHTML = `
                <div class ="product-buttons" id=${productItem["id"]}>
	                <img class="product-button__info" src="img/right.svg" alt="product-more">
	                <img class="product-button__delete" src="img/delete-product.svg" alt="product-delete">
                </div>
                `
            break;
            default:
                td.textContent = productItem[keyOfProduct];
        }
        bodyRow.appendChild(td);
    })
    tbody.append(bodyRow);
})
}

async function getCountOfProducts(choosedStore){
    const serverDataProducts = await serverGetProducts(+choosedStore.id);
    const allProducts = document.querySelector(".details-header__count-all");
    const okProducts = document.querySelector(".details-header__count-ok");
    const storageProducts = document.querySelector(".details-header__count-storage");
    const outOfStockProducts = document.querySelector(".details-header__count-absent");
    allProducts.textContent = serverDataProducts.length;
    okProducts.textContent = serverDataProducts.filter(productItem => productItem["Status"] === "OK").length;
    storageProducts.textContent = serverDataProducts.filter(productItem => productItem["Status"] === "STORAGE").length;
    outOfStockProducts.textContent = serverDataProducts.filter(productItem => productItem["Status"] === "OUT_OF_STOCK").length;
}

async function renderProductCategory(choosedStore) {
    const categoryStatusOk = await serverGetProductStatus(+choosedStore.id, "OK");
    const categoryStatusStorage = await serverGetProductStatus(+choosedStore.id, "STORAGE");
    const categoryStatusAbsent = await serverGetProductStatus(+choosedStore.id, "OUT_OF_STOCK");

    document.querySelector(".category-ok").addEventListener("click", ()=> renderTableBody(categoryStatusOk));
    document.querySelector(".category-storage").addEventListener("click", ()=> renderTableBody(categoryStatusStorage));
    document.querySelector(".category-absent").addEventListener("click", ()=> renderTableBody(categoryStatusAbsent));
}

async function searchStores(){
    const textFromInput = document.querySelector(".stores-list__header-input").value;
    const filteredStores = await serverFilterStores(textFromInput);
    if (filteredStores.length !== 0) {
        sideBarList.innerHTML = "";
        renderStores(filteredStores);
    } else {
        sideBarList.innerHTML = `
        <li class="sidebar-list__search-error">
        Your search did not return any results.
        </li>`
    }
}

async function searchProducts(){
    const detailsTableBody = document.querySelector(".details-body__table-tbody");
    const textFromInput = document.querySelector(".details-body__input").value;
    let filteredProducts = await serverFilterProducts(textFromInput,+currentStore.id);
    if (filteredProducts.length !== 0) {
        detailsTableBody.innerHTML = "";
        renderTableBody(filteredProducts);
    } else {
        detailsTableBody.innerHTML = `
        <li class="sidebar-list__search-error">
        Your search did not return any results.
        </li>`
    }
}

document.querySelector(".delete-shop__confirm-btn").addEventListener("click", async function(event){
    event.preventDefault();
    let deleteStorelist = deleteStoreProducts(+currentStore.id);
    let deleteStoreData = await deleteStore(+currentStore.id);
    const serverDataStores = await serverGetStores();
    renderStores(serverDataStores);
    document.querySelector(".details").classList.add("js-hidden");
    document.querySelector(".wrapper").classList.remove("js-hidden");
    document.querySelector(".products-popup__delete-shop").style.display = "none";
    document.querySelector(".store-popup__delete-successful").style.display = "block";
    setTimeout(function() {
        document.querySelector(".store-popup__delete-successful").style.display = "none"
    }, 3000);
})

document.querySelector(".delete-product__confirm-btn").addEventListener("click", async function(event){
    event.preventDefault();

    let deleteCurrentProduct = await deleteStoreProduct(+currentProduct.id);
    renderTableBodyAll(currentStore);
    getCountOfProducts(currentStore);
    renderProductCategory(currentStore);
    document.querySelector(".products-popup__delete-product").style.display = "none";
    document.querySelector(".product-popup__delete-successful").style.display = "block";
    setTimeout(function() {
        document.querySelector(".product-popup__delete-successful").style.display = "none"
    }, 3000);
})

document.addEventListener("DOMContentLoaded", function () {
    init();    
});

document.querySelector('#store-popup__form').addEventListener("submit", async function(event){
    event.preventDefault()

    let newStore = {
        Name: document.getElementById("store-popup__name").value,
        Email: document.getElementById("store-popup__email").value,
        PhoneNumber: document.getElementById("store-popup__phone").value,
        Address: document.getElementById("store-popup__address").value,
        Established: new Date(document.getElementById("store-popup__date").value),
        FloorArea: Number(document.getElementById("store-popup__square").value),
    }
    
        let serverStoreData = await serverAddStore(newStore);
        serverStoreData.Established = new Date(serverStoreData.Established);
        const serverDataStores = await serverGetStores();
        renderStores(serverDataStores);
        document.querySelector(".store-popup").style.display = "none";
    
        event.target.reset();
});

document.querySelector('#products-popup__form').addEventListener("submit", async function(event){
        event.preventDefault();
        
        let newProduct = {
            Name: document.getElementById("products-popup__name").value,
            Price: Number(document.getElementById("products-popup__price").value),
            Photo: 'photo of product',
            Specs: document.getElementById("products-popup__specs").value,
            Rating: Number(document.getElementById("products-popup__rating").value),
            SupplierInfo: document.getElementById("products-popup__info").value,
            MadeIn: document.getElementById("products-popup__origin").value,
            ProductionCompanyName: document.getElementById("products-popup__company-name").value,
            Status: document.getElementById("products-popup__status").value.toUpperCase(),
            StoreId:  Number(`${currentStore.id}`)
        }
        let serverProductData = await serverAddProduct(+currentStore.id, newProduct);
        renderTableBodyAll(currentStore);
        getCountOfProducts(currentStore);
        document.querySelector(".products-popup").style.display = "none";
        event.target.reset();
});

document.querySelector(".stores-list__footer-button").addEventListener("click", function() {
    document.querySelector(".store-popup").style.display = "block";
});

document.querySelector(".store-popup__button-cancel").addEventListener("click", function() {
    document.querySelector(".store-popup").style.display = "none";
});

document.querySelector(".details-footer__button-create").addEventListener("click", function() {
    document.querySelector(".products-popup").style.display = "block";
});

document.querySelector(".products-popup__button-cancel").addEventListener("click", function() {
    document.querySelector(".products-popup").style.display = "none";
});

document.querySelector(".details-footer__button-delete").addEventListener("click", function() {
    document.querySelector(".products-popup__delete-shop").style.display = "block";
});

document.querySelector(".delete-shop__cancel-btn").addEventListener("click", function() {
    document.querySelector(".products-popup__delete-shop").style.display = "none";
});

document.addEventListener("click", (event)=> {
        if (event.target.className === 'product-button__delete') {
            currentProduct = event.target.closest("div");  
            document.querySelector(".products-popup__delete-product").style.display = "block";
        }
});

document.querySelector(".delete-product__cancel-btn").addEventListener("click", function() {
    document.querySelector(".products-popup__delete-product").style.display = "none";
});

const storeList = document.querySelector(".stores-list__body");
const scrollHeightToShow = 100;
storeList.addEventListener("scroll", function() {
    const searchbar = document.getElementById("searchbar");

    if (storeList.scrollTop > scrollHeightToShow || storeList.scrollTop > scrollHeightToShow) {
        searchbar.style.display = "none";
        document.querySelector(".stores-list__header").style.paddingBottom = "0px"
        storeList.style.marginTop = "55px";
        storeList.style.height = "calc(100vh - 55px)";
    } else {
        searchbar.style.display = "block";
        document.querySelector(".stores-list__header").style.paddingBottom = "10px"
        storeList.style.marginTop = "115px";
        storeList.style.height = "calc(100vh - 115px)";
    }
});

const detailsBody = document.querySelector(".details-body");
detailsBody.addEventListener("scroll", function() {
    const detailsHeaderInfo = document.querySelector(".details-header__info");
    const detailsHeaderButtons = document.querySelector(".details-header__buttons");
    const detailsCollapseSection = document.querySelector(".details-header__collapse-section");

    if (detailsBody.scrollTop > scrollHeightToShow || storeList.scrollTop > scrollHeightToShow) {
        detailsHeaderInfo.style.display = "none";
        detailsHeaderButtons.style.display = "none";
        detailsBody.style.marginTop = "47px";
        detailsBody.style.height = "calc(100vh - 47px)";
    } else {
        detailsHeaderInfo.style.display = "flex";
        detailsHeaderButtons.style.display = "flex";
        detailsBody.style.marginTop = "270px";
        detailsBody.style.height = "calc(100vh - 270px)";
    }
});

document.addEventListener("click", (event)=> {
    if (event.target.className === "details-body__sort-button"){
        event.target.classList.remove("details-body__sort-button");
        event.target.classList.add("details-body__sort-up")
        sortController(event.target)
    }if (event.target.className === "details-body__sort-up"){
        event.target.classList.remove("details-body__sort-up");
        event.target.classList.add("details-body__sort-down")
        sortController(event.target)
    }else if(event.target.className === "details-body__sort-down"){
        event.target.classList.remove("details-body__sort-down");
        event.target.classList.add("details-body__sort-up")
        sortController(event.target);
    }
})

async function sortController(target){

        const tableTh = target.closest("th");
        const sortField = tableTh.dataset.sort;

        if(sortField){
            const products = await serverGetProducts(+currentStore.id);

            switch(sortField){
                case "Price":
                case "Rating":
                    if(target.dataset.direction === "up"){
                        target.dataset.direction = "down";
                        products.sort((a,b)=>a[sortField] > b[sortField] ? -1: 1);
                    }else{
                        target.dataset.direction = "up";
                        products.sort((a,b)=>a[sortField] > b[sortField] ? 1: -1);
                    }
                break;
                case "Country of origin": 
                if(target.dataset.direction === "up"){
                    target.dataset.direction = "down";
                    products.sort((a,b)=>b["MadeIn"].localeCompare(a["MadeIn"]), "en")
                }else{
                    target.dataset.direction = "up";
                    products.sort((a,b)=>a["MadeIn"].localeCompare(b["MadeIn"]), "en")
                }
            break;
                case "Name":
                case "Specs":
                case "SupplierInfo":
                    if(target.dataset.direction === "up"){
                        target.dataset.direction = "down";
                        products.sort((a,b)=>b[sortField].localeCompare(a[sortField]), "en")
                    }else{
                        target.dataset.direction = "up";
                        products.sort((a,b)=>a[sortField].localeCompare(b[sortField]), "en")
                    }
                break;
                case "Prod.Company":
                    if(target.dataset.direction === "up"){
                        target.dataset.direction = "down";
                        products.sort((a,b)=>b["ProductionCompanyName"].localeCompare(a["ProductionCompanyName"]), "en")
                    }else{
                        target.dataset.direction = "up";
                        products.sort((a,b)=>a["ProductionCompanyName"].localeCompare(b["ProductionCompanyName"]), "en")
                    }
            }
            renderTableBody(products);
        }
}