import {expect} from '@playwright/test';

/*
* Operation page represents the WelcomePage where the user can proceed with the Transaction, Deposit and Withdraw operations
* This class provide the core logic of the Operation page test. 
*/
exports.OperationPage =
class OperationPage {
    constructor(page){
        this.page = page;
        this.withdrawErrorMsg = 'Transaction Failed. You can not withdraw amount more than the balance.';
        this.depositSuccessMsg = 'Deposit Successful';
        this.withdrawSuccessMsg = 'Transaction successful';
        this.defaultAccountNumber = '1004';
        this.defaultCurrency = 'Dollar';
        this.userGreeting = 'Welcome Harry Potter !!';
    }

    //Locators - Used to identify components in page
    userGreetingLocator = () => this.page.getByText(this.userGreeting, { exact: true });
    accountNumberLocator = () =>this.page.locator('strong').filter({ hasText: this.defaultAccountNumber });
    currecyLocator = () => this.page.getByText(this.defaultCurrency, {exact: true});

    depositSuccessLocator = () => this.page.getByText(this.depositSuccessMsg, { exact: true });

    withdrawErrorLocator = () => this.page.getByText(this.withdrawErrorMsg, { exact: true });
    withdrawSuccessLocator = () => this.page.getByText(this.withdrawSuccessMsg, { exact: true });

    currentBalanceLocator = (balance) => this.page.getByRole('strong').getByText(balance.toString(), { exact: true });

    //Asserts
    depositNotSuccess = () => expect(this.depositSuccessLocator()).toBeHidden();
    depositSuccess = () => expect(this.depositSuccessLocator()).toBeVisible();

    withdrawNotSuccess = () => expect(this.withdrawErrorLocator()).toBeVisible();
    withdrawSuccess = () => expect(this.withdrawSuccessLocator()).toBeVisible();

    checkBalance = (balance) => expect(this.currentBalanceLocator(balance)).toBeVisible();

    checkUserGreeting = () => expect(this.userGreetingLocator()).toBeVisible();
    checkAccountNumber = () => expect(this.accountNumberLocator()).toBeVisible();
    checkCurrency = () => expect(this.currecyLocator()).toBeVisible();   

    //Actions
    async startDeposit(value){
        await this.page.getByRole('button', { name: 'Deposit'}).first().click();
        await this.page.waitForTimeout(1000); //wait components load
        await this.page.getByPlaceholder('amount').click();
        await this.page.getByPlaceholder('amount').fill(value.toString());
        await this.page.getByRole('form').getByRole('button', { name: 'Deposit'}).click();
    }
    
    async startWithdraw(value){
        //Withdraw button with wrong spelling, once corrected it will be possible to create a generic function for Deposit and Withdraw.
        await this.page.getByRole('button', { name: 'Withdrawl'}).first().click();
        await this.page.waitForTimeout(1000); //wait components load
        await this.page.getByPlaceholder('amount').click();
        await this.page.getByPlaceholder('amount').fill(value.toString());
        await this.page.getByRole('form').getByRole('button', { name: 'Withdraw'}).click();
    }

    async checkUserInformation(balance){
        await this.checkAccountNumber();
        await this.checkUserGreeting();
        await this.checkCurrency();
        await this.checkBalance(balance);
    }
}