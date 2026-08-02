const datesSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUzK_SGZvrt0LQmKTdJ6e_asYdeqllD-YI_ZgtgOAv0K08veeNqP8vAcVVRXe_OyuZKykMT0bPOBC3/pub?gid=0&single=true&output=csv";
// =============================
// SAVED LISTS
// =============================

// =============================
// SAVED LISTS
// =============================

let wishlist = [];

let completed = [];



function createSavedCard(name) {


    return `

    <div class="date-card">

        <h2>
            ${name}
        </h2>


        <p>
            Saved idea
        </p>


    </div>

    `;

}
// =============================
// OUR ADVENTURES
// Main Functions
// =============================


// DARK / LIGHT MODE

const themeButton = document.getElementById("themeToggle");

themeButton.addEventListener("click", () => {

    const body = document.body;

    if (body.classList.contains("light")) {

        body.classList.remove("light");
        body.classList.add("dark");

        themeButton.textContent = "☀️";

    } else {

        body.classList.remove("dark");
        body.classList.add("light");

        themeButton.textContent = "🌙";

    }

});



// =============================
// PAGE NAVIGATION
// =============================


const pages = {

    home: document.getElementById("homePage"),

    scroll: document.getElementById("scrollPage"),

    photos: document.getElementById("photosPage"),

    wishlist: document.getElementById("wishlistPage"),

    completed: document.getElementById("completedPage"),

    add: document.getElementById("addPage")

};



function showPage(pageName) {


    Object.values(pages).forEach(page => {

        page.classList.add("hidden");

    });


    pages[pageName].classList.remove("hidden");


}



const navButtons = document.querySelectorAll(".navButton");


navButtons.forEach(button => {


    button.addEventListener("click", () => {


        const selectedPage = button.dataset.page;


        showPage(selectedPage);


    });


});
// =============================
// FILTER PANEL OPEN/CLOSE
// =============================


const filterButton = document.getElementById("filterButton");

const filterPanel = document.getElementById("filterPanel");

const closeFilter = document.getElementById("closeFilter");



filterButton.addEventListener("click", () => {

    filterPanel.classList.remove("hidden");

});



closeFilter.addEventListener("click", () => {

    filterPanel.classList.add("hidden");

});
// =============================
// WISHLIST + COMPLETED
// =============================


// =============================
// WISHLIST + COMPLETED BUTTONS
// =============================


function updateSavedPages(){


    document.getElementById("wishlistContainer").innerHTML = "";


    document.getElementById("completedContainer").innerHTML = "";



    wishlist.forEach(item => {


        document.getElementById("wishlistContainer").innerHTML +=
        createSavedCard(item);


    });



    completed.forEach(item => {


        document.getElementById("completedContainer").innerHTML +=
        createSavedCard(item);


    });


}




document.querySelectorAll(
".card-buttons button:first-child, .reel-actions button:first-child, .photo-card button"
)
.forEach(button => {


    button.addEventListener("click",()=>{


        wishlist.push("Skyline Drive Picnic");


        updateSavedPages();


    });


});




document.querySelectorAll(
".card-buttons button:last-child, .reel-actions button:last-child"
)
.forEach(button => {


    button.addEventListener("click",()=>{


        completed.push("Skyline Drive Picnic");


        updateSavedPages();


    });


});
// =============================
// LOAD GOOGLE SHEET DATA
// =============================


let dateIdeas = [];


async function loadDates() {


    try {


        const response = await fetch(datesSheetURL);


        const csvText = await response.text();


        const rows = csvText.split("\n");


        const headers = rows[0].split(",");



        dateIdeas = rows.slice(1).map(row => {


            const values = row.split(",");



            let idea = {};


            headers.forEach((header, index) => {


                idea[header.trim()] = values[index]?.trim();


            });



            return idea;


        });



        console.log("Loaded Ideas:", dateIdeas);



        displayDates();



    } catch(error) {


        console.log(
            "Could not load dates:",
            error
        );


    }


}




loadDates();
// =============================
// CREATE DATE CARDS
// =============================


function displayDates(){


    const container =
    document.getElementById("cardContainer");


    container.innerHTML = "";



    dateIdeas.forEach(idea => {


        container.innerHTML += `


        <div class="date-card">


            <div class="card-image">

                ${idea.Image || "📍"}

            </div>



            <h2>

                ${idea.Name || "Unnamed Idea"}

            </h2>



            <p>

                ${idea.Description || ""}

            </p>



            <div class="card-info">


                <span>
                    ${idea.Category || ""}
                </span>


                <span>
                    ${idea.Price || ""}
                </span>


                <span>
                    ${idea.Spoons || ""}
                </span>


            </div>



            <div class="card-buttons">


                <button>
                    ❤️ Wishlist
                </button>


                <button>
                    ✅ Finished
                </button>


            </div>


        </div>


        `;


    });


}