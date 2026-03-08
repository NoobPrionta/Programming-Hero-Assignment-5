

function signIn(){
    let username = document.getElementById("userName").value;

let password = document.getElementById("password").value;
    if(username ==="admin" && password ==="admin123"){
        window.location.href="dashboard.html";
    }
    else{
        alert("Invalid Username or Password.Try again!");
    }
}