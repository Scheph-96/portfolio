import { FileLoader } from "../services/load_file.service";
/**
 * click on email in messages list to show the content
 * 
 * @param {Element} email email shown in the messages list
 * @param {Element} inbox where the email content will be displayed
 */
function emailClick(email, inbox) {
    let fileLoader = new FileLoader();
    email.addEventListener('click', () => {
        fileLoader.loadHtml('../pages_features/email_template.html', null, inbox);
    });
}

export {
    emailClick
}