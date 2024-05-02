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
                    if (error.errorMessage) {
                        alertToast(error.errorMessage.type, error.errorMessage.message);
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

function orderDependenciesMain() {
    execOrder();
}

export {
    orderDependenciesMain,
}

