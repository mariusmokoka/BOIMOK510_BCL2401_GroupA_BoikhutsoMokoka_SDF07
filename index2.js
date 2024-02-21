// Importing Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings
const appSettings = {
    databaseURL: "https://realtime-database-c0c13-default-rtdb.europe-west1.firebasedatabase.app/"

}

// Initializing Firebase app and getting a reference to the database
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// Getting DOM elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Event listener for the add button
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    // Pushing the new item to the database
    push(shoppingListInDB, inputValue)

    // Clearing the input field
    clearInputFieldEl()
})

// Event listener for changes in the shopping list
onValue(shoppingListInDB, function(snapshot){

    if (snapshot.exists()){
        let itemArray = Object.entries(snapshot.val())

        // Clearing the shopping list before updating
        clearShoppingListEl()

        // Looping through the items in the database and appending them to the DOM
        for (let i = 0; i < itemArray.length; i++){
            let currentItem = itemArray[i]
            appendItemToShoppingListEl(currentItem)
        }

    } else {
        // If no items in the database, display a message
        shoppingListEl.innerHTML = "No items yet"
    }
})

// Function to clear the shopping list
function clearShoppingListEl(){
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl(){
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list
function appendItemToShoppingListEl(item){
    let itemID = item[0]
    let itemValue = item[1]

    // Creating a new list item element
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    // Adding a click event listener to remove the item from the database when clicked
    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    // Appending the new list item to the shopping list
    shoppingListEl.append(newEl)
}
