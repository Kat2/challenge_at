exports.LoginPage = 
class LoginPage {

    constructor(page){
        this.page = page;
    };

    async gotoLoginPage(){
        await this.page.goto('https://www.way2automation.com/angularjs-protractor/banking/#/login');
    }

    async login(){
        await this.page.getByRole('button', { name: 'Customer Login' }).click();
        await this.page.locator(this.userSelect).selectOption('2');
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async logout(){
        await this.page.getByRole('button', { name: 'Logout' }).click();
    }
}