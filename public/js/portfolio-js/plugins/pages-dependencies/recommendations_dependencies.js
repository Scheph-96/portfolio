import { AjaxRequest } from "../../../tools/ajax_req.tool.js";
import { routes } from "../../routes/routes.js";

let ajaxRequest = new AjaxRequest();

function sort() {
    const recommendationSortBtns = document.querySelectorAll('.recommendation-sort');
    const recommendationContent = document.querySelector('.more-recommendation-page .recommendation-content');
    for (let i = 0; i < recommendationSortBtns.length; i++) {

        recommendationSortBtns[i].addEventListener('click', e => {
            for (let j = 0; j < recommendationSortBtns.length; j++) {
                if (recommendationSortBtns[j].classList.contains('active')) {
                    recommendationSortBtns[j].classList.remove('active');
                    break;
                }
            }

            recommendationSortBtns[i].classList.add('active');

            ajaxRequest.loadHtml(routes().moreRecommendation.pageUrl + `${e.currentTarget.getAttribute('sort-rate')}`, null, recommendationContent);
        })
    }
}

function recommendationsDependenciesMain() {
    sort();
}

export {
    recommendationsDependenciesMain,
}