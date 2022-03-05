/* =============================
    Toggle Loading
===============================*/
const toggleLoading = (display) => {
    document.getElementById("loading").style.display = display;
};
/* =============================
    Search Mobile 
===============================*/
const searchMobile = () => {
    // Loading
    toggleLoading("block");
    // Search text
    const searchInput = document.getElementById("search-mobile");
    const searchText = searchInput.value.toLowerCase();
    // Clear previous search results
    document.getElementById("mobile-details").textContent = "";
    document.getElementById("mobiles").textContent = "";
    document.getElementById("load-more").style.display = "none";
    document.getElementById("load-less").style.display = "none";
    // Load Mobiles
    if (searchInput.value === "") {
        document.getElementById("no-result").style.display = "block";
        toggleLoading("none");
    } else {
        fetch(
            `https://openapi.programming-hero.com/api/phones?search=${searchText}`
        )
            .then((res) => res.json())
            .then((data) => displayMobiles(data.data));
    }
};
/* =============================
    Mobiles
===============================*/
const devices = (mobiles) => {
    // Display mobiles in the ui
    const mobilesInUi = document.getElementById("mobiles");
    mobiles.map((mobile) => {
        const { phone_name, brand, image, slug } = mobile;
        const div = document.createElement("div");
        div.classList.add("col-md-4");
        div.innerHTML = `
            <div class="card p-4 my-2">
                <div class="d-flex justify-content-center">
                    <img src=${image} class="card-img-top w-75" alt=${phone_name}>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Model: ${phone_name}</h5>
                    <p class="card-text">brand: ${brand}</p>
                    <button class="btn btn-primary" onclick="loadDetails('${slug}')">See Details</button>
                </div>
            </div>
        `;
        mobilesInUi.appendChild(div);
        document.getElementById("no-result").style.display = "none";
    });
};
/* =============================
    Display Mobiles
===============================*/

const displayMobiles = (mobiles) => {
    const loadMoreBtn = document.getElementById("load-more");
    const loadLessBtn = document.getElementById("load-less");
    if (mobiles.length == 0) {
        document.getElementById("no-result").style.display = "block";
    } else if (mobiles.length > 20) {
        const mobiles20 = mobiles.slice(0, 20);
        devices(mobiles20);
        loadMoreBtn.style.display = "block";
        const loadLess = () => {
            document.getElementById("mobiles").textContent = "";
            devices(mobiles20);
            loadMoreBtn.style.display = "block";
            loadLessBtn.style.display = "none";
        };
        loadLessBtn.addEventListener("click", loadLess);
        const loadMore = () => {
            document.getElementById("mobiles").textContent = "";
            devices(mobiles);
            loadMoreBtn.style.display = "none";
            loadLessBtn.style.display = "block";
        };
        loadMoreBtn.addEventListener("click", loadMore);
    } else {
        devices(mobiles);
    }
    toggleLoading("none");
};

// Show mobile details
const loadDetails = (slug) => {
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayDetails(data.data));
};

// Display Details
const displayDetails = (data) => {
    const { name, releaseDate, brand, image } = data;
    const { storage, sensors } = data.mainFeatures;
    const { WLAN, Bluetooth, GPS } = data.others;
    // Show Details
    const mobileDetails = document.getElementById("mobile-details");
    mobileDetails.innerHTML = `
    <div class="card mb-3 p-4" style="max-width: 540px;">
    <div class="row g-0 d-flex align-items-center">
      <div class="col-md-4">
        <img src=${image} class="img-fluid rounded-start w-100" alt=${name}>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">Model: ${name}</h5>
          <p class="card-text">Brand: ${brand}</p>
          <p class="card-text"><small class="text-muted">Release date: ${releaseDate}</small></p>
          <h6>Storage: ${storage}</h6>
          <p class="card-text">Sensors: <small class="text-muted">${sensors.map(
              (sensor) => sensor
          )}</small><p>
          <p class="card-text">WLAN: <small>${WLAN}</small></p>
          <p class="card-text">Bluetooth: <small>${Bluetooth}</small></p>
          <p class="card-text">GPS: <small>${GPS}</small></p>
        </div>
      </div>
    </div>
  </div>
    `;
};
