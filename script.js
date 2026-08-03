// =============================
// OUR ADVENTURES
// Version 2 Script
// =============================


// GOOGLE SHEET

const datesSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUzK_SGZvrt0LQmKTdJ6e_asYdeqllD-YI_ZgtgOAv0K08veeNqP8vAcVVRXe_OyuZKykMT0bPOBC3/pub?gid=0&single=true&output=csv";


// DATA STORAGE

let dateIdeas = [];

let wishlist = [];

let completed = [];


// =============================
// THEME
// =============================


const themeButton = document.getElementById("themeToggle");


themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light");

    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){

        themeButton.textContent = "☀️";

    } else {

        themeButton.textContent = "🌙";

    }

});


// =============================
// PAGE NAVIGATION
// =============================


const pages = {

    home: document.getElementById("homePage"),

    scroll: document.getElementById("scrollPage"),

    wishlist: document.getElementById("wishlistPage"),

    completed: document.getElementById("completedPage"),

    surprise: document.getElementById("surprisePage"),

    add: document.getElementById("addPage")

};



function showPage(pageName){


    Object.values(pages).forEach(page => {

        if(page){

            page.classList.add("hidden");

        }

    });


    if(pages[pageName]){

        pages[pageName].classList.remove("hidden");

    }

}



document.querySelectorAll(".navButton")
.forEach(button => {


    button.addEventListener("click",()=>{


        showPage(button.dataset.page);


    });


});


// =============================
// FILTER PANEL
// =============================


const filterButton =
document.getElementById("filterButton");


const filterPanel =
document.getElementById("filterPanel");


const closeFilter =
document.getElementById("closeFilter");



if(filterButton){

filterButton.addEventListener("click",()=>{

    filterPanel.classList.remove("hidden");

});

}



if(closeFilter){

closeFilter.addEventListener("click",()=>{

    filterPanel.classList.add("hidden");

});

}


// =============================
// CSV READER
// =============================


function parseCSV(text){

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for(let char of text){


        if(char === '"'){

            insideQuotes = !insideQuotes;

        }


        else if(char === "," && !insideQuotes){

            row.push(value);

            value = "";

        }


        else if(char === "\n" && !insideQuotes){

            row.push(value);

            rows.push(row);

            row = [];

            value = "";

        }


        else {

            value += char;

        }


    }


    row.push(value);

    rows.push(row);


    return rows;

}
// =============================
// LOAD GOOGLE SHEET
// =============================


async function loadDates(){


    try {


        const response = await fetch(datesSheetURL);


        const csvText = await response.text();


        const rows = parseCSV(csvText);


        const headers = rows[0].map(header => 
            header.trim()
        );


        dateIdeas = rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {


            let idea = {};


            headers.forEach((header,index)=>{


                idea[header] =
                row[index]?.trim()
                .replace(/^"|"$/g,"")
                || "";


            });


            return idea;


        });


        console.log("Loaded Ideas:", dateIdeas);


        displayDates();


        createFilters();


    }


    catch(error){


        console.log(
            "Could not load dates:",
            error
        );


    }


}



// =============================
// CREATE DATE CARDS
// =============================


function createCard(idea){


return `


<div class="date-card" data-id="${idea.ID}">


<div class="card-image">


${
idea.Image && idea.Image.startsWith("http")

?

`<img src="${idea.Image}" alt="${idea.Name}">`

:

idea.Image || "📍"

}


</div>



<h2>

${idea.Name}

</h2>



<p>

${idea.Description}

</p>



<div class="card-info">


<span>
📂 ${idea.Category}
</span>


${idea.Tags
.split("|")
.map(tag => `
<span>
🏷️ ${tag.trim()}
</span>
`)
.join("")
}


<span>
💰 ${idea.Price}
</span>


<span>
📍 ${idea.Distance}
</span>


<span>
🥄 ${idea.Spoons}
</span>


</div>



<div class="card-buttons">


<button onclick="addWishlist('${idea.ID}')">

    ❤️ Wishlist

</button>


<button onclick="addCompleted('${idea.ID}')">

    ✅ Finished

</button>



</div>



</div>


`;


}




function displayDates(){


const container =
document.getElementById("cardContainer");


if(!container) return;


container.innerHTML = "";



dateIdeas.forEach(idea=>{


container.innerHTML +=
createCard(idea);



});


}



// =============================
// WISHLIST + COMPLETED
// =============================



function addWishlist(id){


if(!wishlist.includes(id)){


wishlist.push(id);


}


updateSavedPages();


}



function addCompleted(id){

    if(!completed.includes(id)){

        completed.push(id);

    }

    updateSavedPages();

}


function createSavedCard(id){

    const idea = dateIdeas.find(item => item.ID === id);


    if(!idea){

        return "";

    }


    return `

    <div class="date-card">

        <h2>
            ${idea.Name}
        </h2>

        <p>
            ${idea.Description}
        </p>

    </div>

    `;

}




function updateSavedPages(){



const wishlistBox =
document.getElementById("wishlistContainer");


const completedBox =
document.getElementById("completedContainer");



if(wishlistBox){


wishlistBox.innerHTML = "";


wishlist.forEach(item=>{


wishlistBox.innerHTML +=
createSavedCard(item);


});


}




if(completedBox){


completedBox.innerHTML = "";


completed.forEach(item=>{


completedBox.innerHTML +=
createSavedCard(item);


});


}



}


// =============================
// FILTER CREATION
// =============================


function createFilters(){


const categoryBox =
document.getElementById("categoryFilters");


const tagBox =
document.getElementById("tagFilters");



if(!categoryBox || !tagBox)
return;



let categories = [];

let tags = [];



dateIdeas.forEach(idea=>{


if(idea.Category &&
!categories.includes(idea.Category)){

categories.push(idea.Category);

}



if(idea.Tags){

idea.Tags.split("|")
.forEach(tag=>{


if(!tags.includes(tag.trim())){

tags.push(tag.trim());

}


});


}



});



categories.forEach(category=>{


categoryBox.innerHTML += `

<label>

<input type="checkbox">

${category}

</label>

`;


});



tags.forEach(tag=>{


tagBox.innerHTML += `

<label>

<input type="checkbox">

${tag}

</label>

`;


});



}


// =============================
// START
// =============================


loadDates();