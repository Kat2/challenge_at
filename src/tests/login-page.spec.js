import {test, expect} from '@playwright/test'

test('Login test', async({page}) =>{
    await page.goto('https://www.way2automation.com/angularjs-protractor/banking/#/login');

    //Expect a title
    await expect(page).toHaveTitle('Protractor practice website - Banking App');
})