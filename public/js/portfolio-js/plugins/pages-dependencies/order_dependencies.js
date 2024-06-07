import { AjaxRequest } from "../../../tools/ajax_req.tool.js";
import { alertToast } from "../../../tools/util.js";
import { contentHandlerOnRawCode } from "../navigation.js";
import { routes } from "../../routes/routes.js";
import { customReplaceState } from "../../../tools/route_loader.tool.js";

let ajaxRequest = new AjaxRequest();

function execOrder() {
    const orderForm = document.getElementById('order-form');
    const submitButton = document.getElementById('submit-button');
    let isSubmit = false;
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isSubmit) {

            isSubmit = true;
            submitButton.disabled = true;
            submitButton.value = "submitting...";

            let order = new FormData(orderForm);


            ajaxRequest.submitForm('/submit-order', order)
                .then((result) => {
                    window.history.replaceState('', '', routes().orderSuccess.addressBarUrl);
                    contentHandlerOnRawCode(result.page);
                    if (result.message) {
                        alertToast(result.type, result.message);
                    }
                })
                .catch((error) => {
                    if (error.errorData) {
                        alertToast(error.errorData.type, error.errorData.message);
                    } else {
                        alertToast('danger', 'Unexpected error. Please try again!');
                    }
                })
                .finally(() => {
                    isSubmit = false;
                    submitButton.disabled = false;
                    submitButton.value = "confirm";

                });

        }

    });

}

function textAreaLimit() {
    const textArea = document.querySelector('textarea');
    const currentSize = document.querySelector('.textarea-current-size');
    const maxSize = document.querySelector('.textarea-max-size');
    const textAreaProgressValue = document.querySelector('.textarea-progress-value');
    const progressBar = document.querySelector('.progress-bar');

    let textAreaMaxSize = textArea.getAttribute('maxlength');
    let textAreaCurrentSize = 0;
    let progress;

    // init maxSize on the view
    maxSize.innerHTML = textAreaMaxSize;
    currentSize.innerHTML = textAreaCurrentSize;
    textAreaProgressValue.innerHTML = '0.00%';

    textArea.addEventListener('input', () => {
        textAreaCurrentSize = currentSize.innerHTML = textArea.value.length;
        // limit the progress to 2 digit after the decimal point
        progress = ((textAreaCurrentSize / textAreaMaxSize) * 100).toFixed(2);
        progressBar.style.width = `${progress}%`;
        textAreaProgressValue.innerHTML = `${progress}%`;
    });

}

function orderDependenciesMain() {
    execOrder();
    textAreaLimit();
}

export {
    orderDependenciesMain,
}

