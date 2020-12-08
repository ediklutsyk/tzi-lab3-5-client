const keysFields = [
    document.getElementById("keyEncode"),
    document.getElementById("keyDecode")
];
const passwordFields = [
    document.getElementById("password-signup"),
    document.getElementById("confirmPassword")
];
const valuesFields = [
    document.getElementById("stringToEncode"),
    document.getElementById("stringToDecode"),
    document.getElementById("username-login"),
    document.getElementById("username-signup"),
    document.getElementById("password-login"),
];

let timeout = setTimeout(() => {
    console.log('block')
    isBlocked = true;
    Array.from(document.getElementsByClassName("submit")).forEach(button => button.disabled = true);
    Array.from(document.getElementsByClassName('custom-form'))
        .forEach(item => item.querySelectorAll('input')
            .forEach(item => item.disabled = true));

    setTimeout(() => {
        isBlocked = false;
        Array.from(document.getElementsByClassName("submit")).forEach(button => button.disabled = false);
    }, 300000);
}, 180000)

let isBlocked = false;
let interval = null;

const setupInternal = () => {
    if (window.localStorage.getItem('id') !== null) {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
        interval = setInterval(async () => {
            await validateSession(window.localStorage.getItem('id')).then((result) => {
                console.log('VALIDATE SESSION:', result)
                if (result !== true) {
                    clearInterval(interval);
                    interval = null;
                    window.localStorage.removeItem('id');
                    overlay.style.display = 'flex';
                    clearLoginForm()
                }
            })
        }, 10000);
    }
}

if (!interval) {
    setupInternal()
}

passwordFields.forEach(field => field.addEventListener("keyup", (event) => {
    const loginError = document.getElementById('login-error')
    loginError.innerText = '';
    const signupMessage = document.getElementById('signup-message')
    signupMessage.innerText = '';
    if (!isBlocked) {
        let confirmPassword = document.getElementById("confirmPassword");
        let password = document.getElementById("password-signup");
        if (confirmPassword.value.trim().length && password.value.trim() === confirmPassword.value.trim()) {
            putClassValid(confirmPassword);
            putClassValid(password);
        } else {
            putClassInValid(confirmPassword);
            putClassInValid(password);
        }
    }
}));

keysFields.forEach(field => field.addEventListener("keyup", (event) => {
    let target = event.target;
    let value = target.value.trim();
    if (value.length > 0 && /^\d{6,}$/.test(value)) {
        putClassValid(target);
    } else {
        putClassInValid(target);
    }
}));

valuesFields.forEach(field => field.addEventListener("keyup", (event) => {
    const loginError = document.getElementById('login-error')
    loginError.innerText = '';
    const signupMessage = document.getElementById('signup-message')
    signupMessage.innerText = '';
    let target = event.target;
    let value = target.value.trim();
    if (value.trim().length > 0) {
        putClassValid(target);
    } else {
        putClassInValid(target);
    }
}));

function putClassValid(target) {
    target.classList.remove('is-invalid');
    target.classList.add('is-valid');
    let inputList = target.closest('.custom-form').querySelectorAll('input');
    if (inputList.length === Array.from(inputList).filter(item => item.classList.contains('is-valid')).length) {
        target.closest('.custom-form').querySelector('.submit').disabled = false;
    }
    return target;
}

function putClassInValid(target) {
    Array.from(document.getElementsByClassName("submit")).forEach(button => button.disabled = true);
    target.classList.remove('is-valid');
    target.classList.add('is-invalid');
    return target;
}

function toggleMenu(type) {
    let firstForm;
    let secondForm;
    if (type === 'login' || type === 'signup') {
        firstForm = document.getElementById('login-form');
        secondForm = document.getElementById('signup-form');
    } else {
        firstForm = document.getElementById('decode-form');
        secondForm = document.getElementById('encode-form');
    }
    activateButton(type);
    toggleBlock(firstForm);
    toggleBlock(secondForm);
}

function activateButton(type) {
    if (type === 'encode' || type === 'decode') {
        let encodeBtn = document.getElementById('btn-encode');
        let decodeBtn = document.getElementById('btn-decode');
        encodeBtn.classList.remove('btn-primary', 'btn-outline-secondary');
        decodeBtn.classList.remove('btn-primary', 'btn-outline-secondary');
        if (type === "encode") {
            encodeBtn.classList.add('btn-primary');
            decodeBtn.classList.add('btn-outline-secondary');
        } else if (type === "decode") {
            decodeBtn.classList.add('btn-primary');
            encodeBtn.classList.add('btn-outline-secondary');
        }
    } else {
        let loginBtn = document.getElementById('btn-login');
        let signupBtn = document.getElementById('btn-signup');
        loginBtn.classList.remove('btn-primary', 'btn-outline-secondary');
        signupBtn.classList.remove('btn-primary', 'btn-outline-secondary');
        if (type === "login") {
            loginBtn.classList.add('btn-primary');
            signupBtn.classList.add('btn-outline-secondary');
        } else if (type === "signup") {
            signupBtn.classList.add('btn-primary');
            loginBtn.classList.add('btn-outline-secondary');
        }
    }
}

function toggleBlock(block) {
    if (block.style.display === "none") {
        block.style.display = "block";
    } else {
        block.style.display = "none";
    }
}

// test1234 qwer$

function encodeSubmit() {
    let value = document.getElementById("stringToEncode").value.trim();
    let key = document.getElementById("keyEncode").value.trim();
    console.log(document.getElementById("result"))
    document.getElementById("result").innerText = 'Result:' + gronsfeld(value, key, 'encrypt');
}

function decodeSubmit() {
    let value = document.getElementById("stringToDecode").value.trim();
    let key = document.getElementById("keyDecode").value.trim();
    console.log(document.getElementById("result"))
    document.getElementById("result").innerText = 'Result:' + gronsfeld(value, key, 'decrypt');
}

async function signup() {
    let username = document.getElementById("username-signup").value.trim();
    let pass = document.getElementById("password-signup").value.trim();

    await signUp({
        username: username,
        password: pass
    }).then((result) => {
        console.log('signUp:', result)
        if (result.id) {
            const signupMessage = document.getElementById('signup-message')
            signupMessage.classList.add('success')
            signupMessage.innerText = 'Account has been successfully created. Login please.'
        } else {
            const signupMessage = document.getElementById('signup-message')
            signupMessage.classList.add('error')
            signupMessage.innerText = result.message;
        }
    }).catch((error) => {
        console.log('error login:', error)
    })
}


async function login(lga = false) {
    let username = document.getElementById("username-login").value.trim();
    let pass = document.getElementById("password-login").value.trim();

    await signIn({
        username: username,
        password: pass,
        lga: lga
    }).then((result) => {
        console.log('login:', result)
        if (result.data.id) {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'none';
            window.localStorage.setItem('id', result.data.id);
            clearTimeout(timeout)
            timeout = null
            if (!interval) {
                setupInternal()
            }
        } else {
            if (result.data.message === 'Session limit') {
                toggleBlock(document.getElementById("lga"))
                toggleBlock(document.getElementById("login"))
                document.getElementById("lgaBtn").disabled = false;
            }
            const loginError = document.getElementById('login-error')
            loginError.innerText = result.data.message;
        }
    }).catch((error) => {
        console.log('error login:', error)
    })
}

function clearLoginForm() {
    console.log('clear form')
    let username = document.getElementById("username-login");
    let pass = document.getElementById("password-login");

    username.value = '';
    username.classList.remove('is-valid')
    pass.value = '';
    pass.classList.remove('is-valid')
}

async function logout() {
    await logOut(window.localStorage.getItem('id')).then((res) => {
        console.log('LOGOUT', res);

        if (res) {
            clearInterval(interval);
            interval = null;
            window.localStorage.removeItem('id');
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'flex';
            clearLoginForm();
        }
    }).catch((error) => {
        console.log('LOGOUT ERROR', error)
    })
}

function gronsfeld(value, key, mode) {
    let keyArr = key.split("");
    let result = "";
    let counter = 0;

    value = value.toUpperCase().split('').map(c => c.charCodeAt(0)).filter(c => c >= 65 && c <= 90).map(c => String.fromCharCode(c)).join('');
    for (let i = 0; i < value.length; ++i) {
        let c = value.charCodeAt(i);
        let ki = parseInt(keyArr[counter]);
        if (mode === 'encrypt') {
            if (c <= 90 && (c + ki) > 90) { // uppercase wraparound
                result += String.fromCharCode(64 + parseInt(c + ki - 90));
            } else {
                result += String.fromCharCode(c + ki);
            }
        } else if (mode === 'decrypt') {
            if ((c - ki) < 65) {
                result += String.fromCharCode(91 - parseInt(65 - (parseInt(c) - ki)));
            } else {
                result += String.fromCharCode(c - ki);
            }
        }

        ++counter;

        if (counter === keyArr.length) {
            counter = 0;
        }
        console.log(result)
    }

    return result;
}

