// Key elements of DOM
const headerPanelText = document.querySelector("#headerPanelText");
const mainPanelHeader = document.querySelector("#mainPanelHeader");
const mainPanelData = document.querySelector("#mainPanelData");
const modalForm = document.querySelector("#modalForm");
const modalWindowTitle = document.querySelector("#modalWindowTitle");
const modalWindowButton = document.querySelector("#modalWindowButton");
const modalWindowCloseButton = document.querySelector("#modalWindowClose");

// Global constants
const serverLocation = "http://localhost:8080";

const User = class {
    id = null;
    name = "";
    lastname = "";
    age = null;
    username = "";
    password = "";
    active=false;
    roles = []
};
const state = {
    principal: new User(),
    usersList: [],
};

window.onload = async function () {
    await getDataRequest('mainUser')
        .then((user) => state.principal = user);
    headerPanelUpdate(state.principal);
    leftPanelUpdate(state.principal.roles);
    (state.principal.roles.includes("ADMIN")) ? await startAdminPage() : startUserPage();
}

async function startAdminPage() {
    mainPanelHeader.innerHTML = "Admin Panel";
    await updateAdminTable();
}

function startUserPage() {
    mainPanelHeader.innerHTML = "User information-page"
    mainPanelData.innerHTML='<p> No data yet</p>';
    mainPanelData.innerHTML = getUserPanelData(state.principal);
}

async function updateAdminTable(){
    await getDataRequest("usersList")
        .then((users) => state.usersList = users)
    mainPanelData.innerHTML = getAdminPanelData(state.usersList);
}

function getDataRequest(extension) {
    const requestUrl = serverLocation + "/api/" + extension;
    return fetch(requestUrl,{
        method: "GET",
        headers:{
            "content-type": "application/json; charset=UTF-8"
        }
    })
    .then(result => result.json())
}

function createPostRequest(extension, user) {
    const requestUrl = serverLocation + "/api/" + extension;
    return fetch(requestUrl,{
        method: "POST",
        body: JSON.stringify(user),
        headers:{
            "content-type": "application/json; charset=UTF-8"
        }
    })
        // .then(result => result.json());
}

function getRolesAsString(roles) {
    let text = "";
    for (let role of roles) {
        text += role;
        text += (role != roles[roles.length - 1]) ? ", ":"";
    }
    return text;
}

function editUserFormOpen(index){
    modalWindowTitle.innerHTML = "Edit user";
    const elements = modalForm.elements;
    const user = state.usersList[index];
    elements.id.value = user.id;
    elements.name.value = user.name;
    elements.name.removeAttribute("readonly");
    elements.lastname.value = user.lastname;
    elements.lastname.removeAttribute("readonly");
    elements.age.value = user.age;
    elements.age.removeAttribute("readonly");
    elements.username.value = user.username;
    elements.username.removeAttribute("readonly");
    document.querySelector("#passwordDiv").removeAttribute("hidden");
    elements.password.value = user.password;
    elements.roles.removeAttribute("readonly");
    setUserRolesAttributes(user.roles, elements.roles);
    modalWindowButton.setAttribute("class", "btn btn-primary btn-sm");
    modalWindowButton.innerHTML = "Edit";
}

function deleteUserFormOpen(index) {
    modalWindowTitle.innerHTML = "Delete user";
    const elements = modalForm.elements;
    const user = state.usersList[index];
    elements.id.value = user.id;
    elements.name.value = user.name;
    elements.name.setAttribute("readonly", true);
    elements.lastname.value = user.lastname;
    elements.lastname.setAttribute("readonly", true);
    elements.age.value = user.age;
    elements.age.setAttribute("readonly", true);
    elements.username.value = user.username;
    elements.username.setAttribute("readonly", true);
    elements.username.password = user.password;
    document.querySelector("#passwordDiv").setAttribute("hidden", true);
    elements.roles.setAttribute("readonly", true);
    setUserRolesAttributes(user.roles, elements.roles);
    modalWindowButton.setAttribute("class", "btn btn-danger btn-sm");
    modalWindowButton.innerHTML = "Delete";
}

modalWindowButton.onclick = async function () {
    const elements = modalForm.elements;
    const user = createUserFromElements(elements);
    let action = (modalWindowTitle.innerHTML === "Delete user") ? "userDelete" : "userEdit"
    modalWindowCloseButton.click();
    console.log(action, "user ", user);
    await createPostRequest(action, user);
    await updateAdminTable();
}

function setUserRolesAttributes(roles, element) {
    if (roles.includes("ADMIN")) {
        element.options[0].selected= true;
    } else {
        element.options[0].selected= false;
    }
    if (roles.includes("USER")) {
        element.options[1].selected= true;
    } else {
        element.options[1].selected= false;
    }
}

async function addUser() {
    const elements = document.querySelector("#addUserForm").elements;
    const user = createUserFromElements(elements);
    document.querySelector("#userTable-tab").click();
    console.log("Add user " + user)
    await createPostRequest("userAdd", user);
    await updateAdminTable();
}

function createUserFromElements(formElements) {
    const user = new User();
    if (formElements.id != null) {
        user.id = parseInt(formElements.id.value);
    }
    user.name = formElements.name.value;
    user.lastname = formElements.lastname.value;
    user.age = parseInt(formElements.age.value);
    user.username = formElements.username.value;
    user.password = formElements.password.value;
    user.active = true;
    user.roles = [...formElements.roles.selectedOptions].map(option => option.value);
    return user;
}

function headerPanelUpdate(user) {
    let text = getRolesAsString(user.roles)
    headerPanelText.innerHTML = `<strong> ${user.username} </strong> with roles <strong> ${text} </strong>`;
}
 function leftPanelUpdate(roles) {
    if (roles.includes("ADMIN")) {
        if (roles.includes("USER")) {
            document.querySelector("#openAdminTable").style.display="inline-block";
            document.querySelector("#openUserPagePrim").style.display="none";
            document.querySelector("#openUserPageLink").style.display="inline-block";
        } else {
            document.querySelector("#openAdminTable").style.display="inline-block";
            document.querySelector("#openUserPagePrim").style.display="none";
            document.querySelector("#openUserPageLink").style.display="none";
        }
    } else {
        document.querySelector("#openAdminTable").style.display="none";
        document.querySelector("#openUserPagePrim").style.display="inline-block";
        document.querySelector("#openUserPageLink").style.display="none";
    }
}

function getAdminPanelData(usersList) {
    let text = `
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="userTable-tab" data-bs-toggle="tab" data-bs-target="#userTable" type="button" role="tab" aria-controls="userTable" aria-selected="true">User Table</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="newUser-tab" data-bs-toggle="tab" data-bs-target="#newUser" type="button" role="tab" aria-controls="newUser" aria-selected="false">New User</button>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="userTable" role="tabpanel" aria-labelledby="userTable-tab">
                        <h6 class="mt-2 mx-4 py-1">All users</h6>
                        <div class="container bg-white py-2">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Age</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>`
    for (let i=0; i<usersList.length; i++) {
        text += `
                                         <td>${usersList[i].id}</td>
                                         <td>${usersList[i].name}</td>
                                         <td>${usersList[i].lastname}</td>
                                         <td>${usersList[i].age}</td>
                                         <td>${usersList[i].username}</td>
                                         <td>${getRolesAsString(usersList[i].roles)}</td>
                                         <td><button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" 
                                            data-bs-target="#modalWindow" onclick="editUserFormOpen(${i})">Edit
                                         </button></td>
                                         <td><button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" 
                                            data-bs-target="#modalWindow" onclick="deleteUserFormOpen(${i})">Delete
                                         </button></td>
                                    </tr style="">`
    }
    text +=`
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="newUser" role="tabpanel" aria-labelledby="newUser-tab">
                        <h6 class="mt-2 mx-4 py-1">Add new user</h6>
                        <div class="container bg-white stretch-element py-2">
                            <form action="" name="addUserForm" id="addUserForm" >
                                <div class="row">
                                    <div class="col-md-4 mx-auto pt-2">
                                        <p class="text-center"><strong>First name</strong></p>
                                        <input class="form-control" type="text" field="name" id="name" placeholder="Name">
                                        <p class="text-center"><strong>Last name</strong></p>
                                        <input class="form-control" type="text" field="lastname" id="lastname" placeholder="Last Name">
                                        <p class="text-center"><strong>Age</strong></p>
                                        <input class="form-control" type="number" field="age" id="age" placeholder="Age">
                                        <p class="text-center"><strong>Email</strong></p>
                                        <input class="form-control" type="text" field="username" id="username" placeholder="Username">
                                        <p class="text-center"><strong>Password</strong></p>
                                        <input class="form-control" type="text" field="password" id="password" placeholder="Password">
                                        <p class="text-center"><strong>Role</strong></p>
                                        <select multiple class="form-control w-100 h-20px"
                                                field="roles" id="roles">
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="USER">USER</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <div class="col text-center mt-4">
                                <button class="btn btn-success w-65" id="addUserButton" onclick="addUser()">Add new user </button>
                            </div>
                        </div>
                    </div>
                </div>`
    return text;
}

function getUserPanelData(user) {
    let text = `
        <h6 class="mt-2 mx-4 py-1">About user</h6>
        <div class="container bg-white py-2">
            <div class="container w-100 bg-white">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${getRolesAsString(user.roles)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`
    return text;
}
