var pass1;
var pass2;
console.log("working");

document.getElementById("submit").onclick = function(){
    pass1= document.querySelector(".password1").value;
    console.log(pass1);
    pass2= document.querySelector(".password2").value;
    console.log(pass2);
    if(pass1 === pass2){
        console.log("same")
        document.getElementById("form").btnSubmit();
    }
};

