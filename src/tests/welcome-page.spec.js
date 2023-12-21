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

test.afterAll('Logout', async({browser}) => {
    console.log("Logout application");
    const login = new LoginPage(page);
    login.logout();
});

test.describe('Deposit Scenario', () => {

    test.beforeAll('Setup deposit test cases', async({})=> {
        operationPage = new OperationPage(page);
    });

    test('Deposit a negative value in user account', async({}) => {
        //Arrange
        const defaultDeposit = -100;

        //Action
        await operationPage.startDeposit(defaultDeposit)

        //Assert
        await operationPage.depositNotSuccess();
        await operationPage.balanceShowed(balance);
    });

    test('Deposit 0 USD in user account', async({}) => {
        //Arrange
        const defaultDeposit = 0;

        //Action
        await operationPage.startDeposit(defaultDeposit);

        //Assert
        await operationPage.depositNotSuccess();
        await operationPage.balanceShowed(balance);
    });

    test('Deposit an invalid amount in user account', async({}) => {
        //Arrange
        const defaultDeposit = 'joao';

        //Action - Exception due to deposit field accepts numbers only
        await expect(operationPage.startDeposit(defaultDeposit)).rejects.toThrow();
        
        //Assert
        await operationPage.depositNotSuccess();
        await operationPage.balanceShowed(balance);
    });

    test('Deposit a positive value in user account', async({}) => {
        //Arrange
        const defaultDeposit = 1000;

        //Action
        await operationPage.startDeposit(defaultDeposit);
        balance += defaultDeposit;

        //Assert
        await operationPage.depositSuccess();
        await operationPage.balanceShowed(balance);
    });
});

test.describe('Withdrawl Scenarios', () =>{
    

    test.beforeAll('Setup withdraw tests', async({})=> {
        operationPage = new OperationPage(page);
        //const deposit = 1000;
        //await operationPage.startDeposit(deposit);
    });

    test('Withdraw a value >= the balance', async({}) => {
        //Arrange
        const defaultWithdraw = 1001;

        //Action
        await operationPage.startWithdraw(defaultWithdraw);

        //Assert
        await operationPage.withdrawNotSuccess();
        await operationPage.balanceShowed(balance);
    });

    test('Withdraw a value invalid', async({}) => {
        //Arrange
        const defaultWithdraw = 'Joao';

        //Action - Exception due to withdraw field accepts numbers only
        await expect(operationPage.startWithdraw(defaultWithdraw)).rejects.toThrow();

        //Assert
        await operationPage.withdrawNotSuccess();
        await operationPage.balanceShowed(balance);
    });

    test('Withdraw a value <= the balance', async({}) => {
        //Arrange
        const defaultWithdraw = 1000;

        //Action
        await operationPage.startWithdraw(defaultWithdraw);
        balance -= defaultWithdraw;

        //Assert
        await operationPage.withdrawSuccess();
        await operationPage.balanceShowed(balance);
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
        //Assert
        await operationPage.balanceShowed(balance);
    });
});

/*test('Loged user', async({}) =>{
    //Expect a title
    await expect(page.getByText('Welcome Harry Potter !!', { exact: true })).toBeVisible();
})*/