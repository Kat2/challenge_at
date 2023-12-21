exports.OperationPage =
class OperationPage {
    constructor(page){
        this.page = page;
        this.withdrawErrorMsg = 'Transaction Failed. You can not withdraw amount more than the balance.';
        this.depositSuccessMsg = 'Deposit Successful';
        this.withdrawSuccessMsg = 'Transaction successful';
    }

    async startDeposit(value){
        await this.page.getByRole('button', { name: 'Deposit'}).first().click();
        await this.page.getByPlaceholder('amount').click();
        await this.page.getByPlaceholder('amount').fill(value.toString());
        await this.page.getByRole('form').getByRole('button', { name: 'Deposit'}).click();
    }
    
    async startWithdraw(value){
        //Withdraw button with wrong spelling, once corrected it will be possible to create a generic function for Deposit and Withdraw.
        await this.page.getByRole('button', { name: 'Withdrawl'}).first().click();
        await this.page.waitForTimeout(1000);
        await this.page.getByPlaceholder('amount').click();
        await this.page.getByPlaceholder('amount').fill(value.toString());
        await this.page.getByRole('form').getByRole('button', { name: 'Withdraw'}).click();
    }
}