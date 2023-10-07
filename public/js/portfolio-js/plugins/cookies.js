
class CookiesInterface {
    static setCookie(name, value, expirationHours = 720, path = "/") {
        const date = new Date();
    
        date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=" + path;
    }
    
    
    static getCookie() {
        console.log(document.cookie);
    }
}


module.exports = CookiesInterface;




