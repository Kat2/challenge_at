import {test, expect} from '@playwright/test'
import { LoginPage } from '../page-objects/login-page';


let page;

test.beforeAll('Login into the system', async({browser}) => {
    console.log("Login as Harry Potter");
    page = await browser.newPage();
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.login();
});

test.afterAll('Logout', async({browser}) => {
    console.log("Logout application");
    const login = new LoginPage(page);
    login.logout();
});

test('Loged user', async({}) =>{
    //Expect a title
    await expect(page.getByText('Welcome Harry Potter !!', { exact: true })).toBeVisible();
})