import {test, expect} from '@playwright/test'
import { OperationPage } from '../page-objects/operation-page';
import { LoginPage } from '../page-objects/login-page';

/*
* Page Object Pattern has been used in the tests.
* This class provides a abstraction and the core logic is in operation-page.js file
*/

//Global variables
let page;
let operationPage; //Welcome page with the possible operations (Transaction, Deposit, Withdraw)
let balance = 0; 

//Log in the system before start testing
test.beforeAll('Login into the system', async({browser}) => {

    //Need login to access Operations feature
    console.log("Login as Harry Potter");
    page = await browser.newPage();
    const login = new LoginPage(page);

    //Action to login as test user Harry Potter.
    await login.gotoLoginPage();
    await login.login();
});

//Logout system after testing
test.afterAll('Logout', async({}) => {
    console.log("Logout application");
    const login = new LoginPage(page);

    //Action to logout
    login.logout();
});

//Deposit test cases
test.describe('Deposit Scenario', () => {

    //Create an OperationPage before start testing
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
        await operationPage.checkUserInformation(balance);
    });

    test('Deposit 0 USD in user account', async({}) => {
        //Arrange
        const defaultDeposit = 0;

        //Action
        await operationPage.startDeposit(defaultDeposit);

        //Assert
        await operationPage.depositNotSuccess();
        await operationPage.checkUserInformation(balance);
    });

    test('Deposit an invalid amount in user account', async({}) => {
        //Arrange
        const defaultDeposit = 'joao';

        //Action - Exception due to deposit field accepts numbers only
        await expect(operationPage.startDeposit(defaultDeposit)).rejects.toThrow();
        
        //Assert
        await operationPage.depositNotSuccess();
        await operationPage.checkUserInformation(balance);
    });

    test('Deposit a positive value in user account', async({}) => {
        //Arrange
        const defaultDeposit = 1000;

        //Action
        await operationPage.startDeposit(defaultDeposit);
        balance += defaultDeposit; //Updated the balance

        //Assert
        await operationPage.depositSuccess();
        await operationPage.checkUserInformation(balance);
    });
});

//Withdraw test cases
test.describe('Withdrawl Scenarios', () =>{
    
    //Create an OperationPage before start testing
    test.beforeAll('Setup withdraw tests', async({})=> {
        operationPage = new OperationPage(page);
    });

    test('Withdraw a value >= the balance', async({}) => {
        //Arrange
        const defaultWithdraw = 1001;

        //Action
        await operationPage.startWithdraw(defaultWithdraw);

        //Assert
        await operationPage.withdrawNotSuccess();
        await operationPage.checkUserInformation(balance);
    });

    test('Withdraw a value invalid', async({}) => {
        //Arrange
        const defaultWithdraw = 'Joao';

        //Action - Exception due to withdraw field accepts numbers only
        await expect(operationPage.startWithdraw(defaultWithdraw)).rejects.toThrow();

        //Assert
        await operationPage.withdrawNotSuccess();
        await operationPage.checkUserInformation(balance);
    });

    test('Withdraw a value <= the balance', async({}) => {
        //Arrange
        const defaultWithdraw = 1000;

        //Action
        await operationPage.startWithdraw(defaultWithdraw);
        balance -= defaultWithdraw;

        //Assert
        await operationPage.withdrawSuccess();
        await operationPage.checkUserInformation(balance);
    });
});

//See balance test cases
test.describe('Load screen test', ()=> {

    //Do a 100 Dollars deposit and refresh the page
    test.beforeAll('Reload page', async({})=> {
        const defaultDeposit = 100;
        await operationPage.startDeposit(defaultDeposit);
        balance += defaultDeposit;
        await operationPage.page.reload();
    });

    //Test failing - see TC04 in Functional document
    test('Page reload test', async({})=>{
        //Assert - The page must be UserInformations up to date
        await operationPage.checkUserInformation(balance);
    });
});