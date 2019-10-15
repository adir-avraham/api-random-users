let state = [];
    

$("#userBtn").on("click", getRandomUser)    

function init () {
    state = JSON.parse(localStorage.getItem("usersData")) || [];
    draw(state);
}


    
    function getRandomUser () {
        
        api.getUser().then((res) => {
            users = res.results.map(results => results);
            getUserInfo(users)         
        }).catch(err => console.error("no data", err));
        
    }
    
    
    function getUserInfo(users) {
        const userInfo = users.map((user)=>{
            const {picture ,gender, name, dob, email} = user;
            return {picture , gender, name, dob, email }
        }) 
        state = [...state, userInfo]
        saveToLocalStorage("usersData", state)
        draw(state);
    }
    
    
    
    function draw(userInfo) {
        $("#divUsers").empty();
        
        for (let i = 0; i <= userInfo.length ; i++) {
            
            const user_pic = userInfo[i][0].picture.large
            const user_gender = userInfo[i][0].gender
            const user_name = userInfo[i][0].name.first
            const user_age = userInfo[i][0].dob.age
            const user_email = userInfo[i][0].email
            
            
            const clonedCard = $("#userCard").clone();
            clonedCard.find("img").attr({src: user_pic});
            clonedCard.css({ display: "inline-block" });
            clonedCard.find("h3").html(`Name: ${user_name}`);
            clonedCard.find("h4").html(`Gender: ${user_gender}`);
            clonedCard.find("h5").html(`age: ${user_age}`);
            clonedCard.find("p").html(`Email: ${user_email}`);
            clonedCard.find("#delBtn").on("click", function (event) {
                deleteUser(event)
            })
            clonedCard.find("#editBtn").on("click", function (event) {
                editUser(event)
            })
            clonedCard.find("#saveBtn").on("click", function (event) {
                saveEdit(event)
            })
            
            clonedCard.attr("id", user_name)
            $("#divUsers").append(clonedCard);       
        }
    }
    
    
    
    function deleteUser(e) {
        const userItem = e.target.parentElement.parentElement.id;
        const currentUsers = state.filter((user) => {
            return  user[0].name.first !== userItem; 
        })
        state = currentUsers;
        saveToLocalStorage("usersData", state)
        draw(state)
    }
    
    function editUser(e) {
        const userItem = e.target.parentElement.parentElement.id;
        const currentUser = state.filter((user) => {
            return  user[0].name.first === userItem; 
        })
        const emailToEdit = currentUser[0][0].email
        $("#inputEmail").val(emailToEdit);
    }
    
    
    
    function saveEdit(e) {
        const newEmail = $("#inputEmail").val();
        const userId = e.target.parentElement.parentElement.id; 
        
        const currnetUser = state.find((user)=> {
            return user[0].name.first === userId;
        })
        currnetUser[0].email = newEmail;
        $("#inputEmail").val("");
        saveToLocalStorage("usersData", state)
        draw(state)
        
    }

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

init ()