// create a mockAPI project
// send getAllRequest
// and populate that in a grid - with UI
// two buttons for each record - edit and delete (when clicked it should actually edit(PUT) or delete(DELETE)(after confirmation))
// render image properly
// add an ADD button at the top to add records
// use classes methods
// use async and await
// use modal popups

class APIHandler {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getRequest() {
        let response = await fetch(this.baseUrl);
        let data = await response.json();
        return data;
    }

    async postRequest(data) {
        let response = await fetch(this.baseUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async putRequest(id, data) {
        let response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async deleteRequest(id) {
        let response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE'
        });
    }
}

let handler = new APIHandler("https://65a8ca26219bfa37186794f1.mockapi.io/v1/listRecords");

let images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // List of random images

let getCurrentDateString = () => {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

let populateTable = async () => {
    let response = await handler.getRequest();
    let table = document.querySelector("#myTable tbody");
    table.innerHTML = '';

    response.forEach((item) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.name}</td><td>${item.createdAt}</td><td>${item.id}</td>
            <td><img src="${item.avatar}" /></td>
            <td><button onclick='editRecord(${item.id})'>Edit</button>
            <button onclick='deleteRecord(${item.id})'>Delete</button></td>`;
        table.appendChild(tr);
    }); 
};

window.onload = populateTable;

let addRecord = () => {
    document.getElementById('modal-add').style.display = "block";
}

let addData = async () => {
    let name = document.getElementById('addname').value;
    let createdAt = getCurrentDateString();
    let imageUrl = images[Math.floor(Math.random() * images.length)]; 
    await handler.postRequest({name: name, createdAt: createdAt, avatar: imageUrl});
    document.getElementById('modal-add').style.display = "none";
    populateTable();
  }

let deleteRecord = async (id) => {
    document.getElementById('modal-delete').style.display = "block";
    document.getElementById('confirm-delete').onclick = async function() {
        await handler.deleteRequest(id);
        document.getElementById('modal-delete').style.display = "none";
        populateTable();
    }
}

let editRecord = (id) => {
    document.getElementById('modal-edit').style.display = "block";
    document.getElementById('submit-edit').onclick = async function() {
        let name = document.getElementById('editname').value;
        let createdAt = getCurrentDateString();
        await handler.putRequest(id, {name: name, createdAt: createdAt});
        document.getElementById('modal-edit').style.display = "none";
        populateTable();
    }
}

document.getElementById('close-add').onclick = function() {
    document.getElementById('modal-add').style.display = "none";
}
document.getElementById('close-edit').onclick = function() {
    document.getElementById('modal-edit').style.display = "none";
}
document.getElementById('cancel-delete').onclick = function() {
    document.getElementById('modal-delete').style.display = "none";
}