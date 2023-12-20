import {test, expect} from '@playwright/test'
import { OperationPage } from '../page-objects/operation-page';
import { LoginPage } from '../page-objects/login-page';


let page;

test.beforeAll('Login into the system', async({browser}) => {
    console.log("Login as Harry Potter");
    page = await browser.newPage();
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.login();
});

/*test.afterAll('Logout', async({browser}) => {
    console.log("Logout application");
    const login = new LoginPage(page);
    login.logout();
});*/

test.describe('Deposit Scenario', () => {
    let operationPage;
    let operation;

    test.beforeAll('Setup deposit test cases', async({})=> {
        operationPage = new OperationPage(page);
        operation = 'Deposit'
    });

    test('Deposit a negative value in user account', async({}) => {
        const defaultDeposit = -100;
        await operationPage.startOperation(operation, defaultDeposit)
        await expect(operationPage.page.getByText('Deposit Successful', { exact: true })).toBeHidden();
    });

    test('Deposit 0 USD in user account', async({}) => {
        const defaultDeposit = 0;
        await operationPage.startOperation(operation, defaultDeposit)
        await expect(operationPage.page.getByText('Deposit Successful', { exact: true })).toBeHidden();
    });

    test('Deposit an invalid amount in user account', async({}) => {
        const defaultDeposit = 'joao';
        await expect(operationPage.startOperation(operation, defaultDeposit)).rejects.toThrow();
        await expect(operationPage.page.getByText('Deposit Successful', { exact: true })).toBeHidden();
    });

    test('Deposit a positive value in user account', async({}) => {
        const defaultDeposit = 900;
        await operationPage.startOperation(operation, defaultDeposit)
        await expect(operationPage.page.getByText('Deposit Successful', { exact: true })).toBeVisible();
        await expect(operationPage.page.getByRole('strong').getByText(defaultDeposit.toString())).toBeVisible();
    });
});
/*
test.describe('Withdrawl Scenarios', () =>{
    let operationPage;

    test.beforeAll('Setup deposit test cases', async({})=> {
        operationPage = new OperationPage(page);
    });

    test.afterEach('Reload Page', async({})=> {
        operationPage.page.reload();
    })

    test('Withdrawl a value >= the balance', async({}) => {
        const defaultWithdrwal = 100;
        await operationPage.startDeposit(defaultDeposit)
        await expect(operationPage.page.getByText('Deposit Successful', { exact: true })).toBeVisible();
        await expect(operationPage.page.getByText(operationPage.balance.toString(), { exact: true })).toBeVisible();
    });
})*/

test('Loged user', async({}) =>{
    //Expect a title
    await expect(page.getByText('Welcome Harry Potter !!', { exact: true })).toBeVisible();
})