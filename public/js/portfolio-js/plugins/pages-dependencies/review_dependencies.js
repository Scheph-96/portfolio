import { AjaxRequest } from "../../../tools/ajax_req.tool.js";
import { alertToast } from "../../../tools/util.js";
import { contentHandlerOnRawCode } from "../navigation.js";
import { routes } from "../../routes/routes.js";
import { customReplaceState } from "../../../tools/route_loader.tool.js";


let ajaxRequest = new AjaxRequest();

function starsHandler() {
    const stars = document.querySelectorAll('.main-content .container .review-rate .bx');

    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener('click', () => {
            for (let index = 0; index < stars.length; index++) {
                stars[index].classList.remove('active');
            }
            // if (i > 0) {
            for (let j = 0; j <= i; j++) {
                stars[j].classList.add('active');
            }
            // }
        });
    }
}

function execReview() {
    const reviewForm = document.getElementById('review-form');
    const submitButton = document.getElementById('submit-button');
    let isSubmit = false;
    console.log('EXECUTE REVIEW');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!isSubmit) {

                isSubmit = true;
                submitButton.disabled = true;
                submitButton.value = "submitting...";

                let review = new FormData(reviewForm);

                if (review.get("rate") == null) {
                    alertToast("warning", "Please provide a rate");
                }

                console.log('THE REVIEW: ', review.get("rate"));
                console.log('THE REVIEW: ', ...review);

                let path = window.location.pathname.split('/');
                let token = path[path.length - 1];

                ajaxRequest.submitForm(`/user/review/post/${token}`, review)
                    .then((result) => {
                        console.log(result);
                        // contentHandlerOnRawCode(result.page);
                        // customReplaceState(result.page, '', routes().reviewSuccess.addressBarUrl);
                        window.history.replaceState('', '', routes().reviewSuccess.addressBarUrl);
                        contentHandlerOnRawCode(result.page);
                        // alertToast(result.type, result.message);
                        if (result.message) {
                            alertToast(result.type, result.message);
                        }
                    })
                    .catch((error) => {
                        if (error.status === 404) {
                            alertToast(error.errorMessage.type, error.errorMessage.message);
                            contentHandlerOnRawCode(error.errorMessage.page);
                        } else {
                            if (error.errorMessage) {
                                alertToast(error.errorMessage.type, error.errorMessage.message);
                            }
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

}

function reviewDependenciesMain() {
    execReview();
    starsHandler();
}

export {
    reviewDependenciesMain,
}

