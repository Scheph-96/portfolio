import { AjaxRequest } from "../tools/ajax_req.tool.js";
import { alertToast } from "../tools/util.js";

function login() {
    let ajaxRequest = new AjaxRequest();
    const loginForm = document.getElementById('login-form');
    const submitButton = document.getElementById('submit-button');
    let isSubmit = false;
    console.log('EXECUTE LOGIN');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isSubmit) {

            isSubmit = true;
            submitButton.disabled = true;
            submitButton.value = "submitting...";

            let loginCredentials = new FormData(loginForm);

            console.log('THE LOGIN CREDENTIALS: ', loginCredentials);
            console.log('THE LOGIN CREDENTIALS: ', ...loginCredentials);
            // setTimeout(() => {

            ajaxRequest.submitForm('/sc-admin/login', loginCredentials)
                .then((result) => {
                    console.log("THE LOGIN RESULT: ", result);
                    if (result.message) {
                        alertToast(result.type, result.message);
                    }

                    if (result.redirectionUrl) {
                        window.location.href = window.location.origin + result.redirectionUrl;
                    }
                })
                .catch((error) => {
                    if (error.errorMessage) {
                        alertToast(error.errorMessage.type, error.errorMessage.message);
                    }
                    console.log(`ERR::::::::::::`);
                    console.error(`ERROR:: ${error.error}`);
                })
                .finally(() => {
                    isSubmit = false;
                    submitButton.disabled = false;
                    submitButton.value = "confirm";

                });
            // }, 5000);

        }

    });

}


window.onload = login();