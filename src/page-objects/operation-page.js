exports.OperationPage =
class OperationPage {
    constructor(page){
        this.page = page;
    }

    async startOperation(operation, value){
        await this.page.getByRole('button', { name: operation}).first().click();
        await this.page.getByPlaceholder('amount').click();
        await this.page.getByPlaceholder('amount').fill(value.toString());
        await this.page.getByRole('form').getByRole('button', { name: operation}).click();
    }
    
    async startWithDrawl(value){

    }
}