var pass1;
var pass2;

function readPassword1(elem) {
    console.log(elem.value);
    pass1 = elem.value;
    //...
}

function readPassword2(elem) {
    console.log(elem.value);
    pass2 = elem.value;
//...
}

document.getElementById("submit").onclick = function(){
    if(pass1 == pass2){
        document.getElementById("form").submit();
    }
};

