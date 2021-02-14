//Use resource @ GonzalezL13 - however I defined and ref the code to show understanding 

// defines db
let db;

//Defined the variable request to be equal to the indexedDB with is in the Application section > Storage.
const request = indexedDB.open('budget', 1);

//Event Handler to create the 
//https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/onupgradeneeded
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};
//method of the IDBDatabase interface creates and returns a new object store or index

request.onsuccess = function (event) {
    db = event.target.result;
//interface handles the success event, fired when the result of a request is successfully returned.
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};
// this function is defining the recored to be saved and defines the transactiona & Store 
function saveRecord(record) {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");

    store.add(record);
};

function uploadBudget() {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    const transaction = db.transaction(["new_budget"], "readwrite");
                    const store = transaction.objectStore("new_budget");
                    store.clear();
                });
        }
    };
}

window.addEventListener('online', uploadBudget);