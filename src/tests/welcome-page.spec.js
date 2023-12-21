import {test, expect} from '@playwright/test'
import { OperationPage } from '../page-objects/operation-page';
import { LoginPage } from '../page-objects/login-page';


let page;
let operationPage;
let balance = 0;

test.beforeAll('Login into the system', async({browser}) => {
    //Need login to access Operations feature
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

    test.beforeAll('Setup deposit test cases', async({})=> {
        operationPage = new OperationPage(page);
    });

    test('Deposit a negative value in user account', async({}) => {
        const defaultDeposit = -100;
        await operationPage.startDeposit(defaultDeposit)
        await expect(operationPage.page.getByText(operationPage.depositSuccessMsg, { exact: true })).toBeHidden();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });

    test('Deposit 0 USD in user account', async({}) => {
        const defaultDeposit = 0;
        await operationPage.startDeposit(defaultDeposit)
        await expect(operationPage.page.getByText(operationPage.depositSuccessMsg, { exact: true })).toBeHidden();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });

    test('Deposit an invalid amount in user account', async({}) => {
        const defaultDeposit = 'joao';
        await expect(operationPage.startDeposit(defaultDeposit)).rejects.toThrow();
        await expect(operationPage.page.getByText(operationPage.depositSuccessMsg, { exact: true })).toBeHidden();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });

    test('Deposit a positive value in user account', async({}) => {
        const defaultDeposit = 1000;
        await operationPage.startDeposit(defaultDeposit);
        balance += defaultDeposit;
        await expect(operationPage.page.getByText(operationPage.depositSuccessMsg, { exact: true })).toBeVisible();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });
});

test.describe('Withdrawl Scenarios', () =>{
    

    test.beforeAll('Setup withdraw tests', async({})=> {
        operationPage = new OperationPage(page);
        //const deposit = 1000;
        //await operationPage.startDeposit(deposit);
    });

    test('Withdraw a value >= the balance', async({}) => {
        const defaultWithdraw = 1001;
        await operationPage.startWithdraw(defaultWithdraw);
        await expect(operationPage.page.getByText(operationPage.withdrawErrorMsg, { exact: true })).toBeVisible();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });

    test('Withdraw a value invalid', async({}) => {
        const defaultWithdraw = 'Joao';
        await expect(operationPage.startWithdraw(defaultWithdraw)).rejects.toThrow();
        await expect(operationPage.page.getByText(operationPage.withdrawErrorMsg, { exact: true })).toBeVisible();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });

    test('Withdraw a value <= the balance', async({}) => {
        const defaultWithdraw = 1000;
        await operationPage.startWithdraw(defaultWithdraw);
        balance -= defaultWithdraw;
        await expect(operationPage.page.getByText(operationPage.withdrawSuccessMsg, { exact: true })).toBeVisible();
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });
});

test.describe('Load screen test', ()=> {
    test.beforeAll('Reload page', async({})=> {
        const defaultDeposit = 100;
        await operationPage.startDeposit(defaultDeposit);
        balance += defaultDeposit;
        await operationPage.page.reload();
    });

    test('Page reload test', async({})=>{
        await expect(operationPage.page.getByRole('strong').getByText(balance.toString(), { exact: true })).toBeVisible();
    });
});

/*test('Loged user', async({}) =>{
    //Expect a title
    await expect(page.getByText('Welcome Harry Potter !!', { exact: true })).toBeVisible();
})*/