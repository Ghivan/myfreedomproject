const {LocationModel, TripModel, CustomerModel, transform} = require('../model/database');
const webdriver = require('selenium-webdriver');
const {By, until, Key} = webdriver;

const TIME_FOR_TEST = 15000;
const PAUSE = {
    short: 1000,
    middle: 2000,
    long: 3000
};
const TARGET_BROWSER = webdriver.Browser.FIREFOX;

const setPause = timeout => new Promise(resolve => {
    setTimeout(resolve, timeout);
});

const clearInputValue = (locator) => {
    locator.sendKeys(Key.CONTROL + "a");
    locator.sendKeys(Key.DELETE);
};

jest.setTimeout(TIME_FOR_TEST);

beforeEach((done) => {
    Promise.all([LocationModel.remove({}), TripModel.remove({}), CustomerModel.remove({})])
        .then(() => done());
});

it('should create 2 locations, 1 trip and 1 customer', () => {
    const locations = [
        {
            city: 'Moscow',
            country: 'Russia'
        },
        {
            city: 'Paris',
            country: 'France'
        }
    ];
    const trips = [
        {
            name: 'From Paris with love',
            arrivalDate: TARGET_BROWSER === webdriver.Browser.CHROME ? '20-01-2017' : '2017-01-20',
            departureDate: TARGET_BROWSER === webdriver.Browser.CHROME ? '29-01-2017' : '2017-01-29'
        }
    ];
    const customers = [
        {
            firstName: 'John',
            lastName: 'Johnson'
        }
    ];
    const driver = new webdriver.Builder().forBrowser(TARGET_BROWSER).build();
    driver.manage().window().setSize(1024, 768);
    return driver.get('http://localhost:3000')
        .then(() => driver.wait(until.elementLocated(By.partialLinkText('Locations'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.linkText('Add new location'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.css('form'))))
        .then(() => {
            const cityInput = driver.findElement(By.id('city'));
            const countryInput = driver.findElement(By.id('Country'));
            const addButton = driver.findElement(By.className('btn-primary'));
            cityInput.sendKeys(locations[0].city);
            countryInput.sendKeys(locations[0].country);
            addButton.click();
        })
        .then(() => driver.wait(until.elementLocated(By.linkText('Add new location'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.css('form'))))
        .then(() => {
            const cityInput = driver.findElement(By.id('city'));
            const countryInput = driver.findElement(By.id('Country'));
            const addButton = driver.findElement(By.className('btn-primary'));
            cityInput.sendKeys(locations[1].city);
            countryInput.sendKeys(locations[1].country);
            addButton.click();
        })
        .then(() => driver.wait(until.elementLocated(By.partialLinkText('Trips'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.linkText('Add new trip'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.css('form'))))
        .then(() => {
            const nameInput = driver.findElement(By.id('tripName'));
            const arrivalInput = driver.findElement(By.id('arrivalDate'));
            const departureInput = driver.findElement(By.id('departureDate'));
            const addButton = driver.findElement(By.className('btn-primary'));
            clearInputValue(nameInput);
            clearInputValue(arrivalInput);
            clearInputValue(departureInput);
            nameInput.sendKeys(trips[0].name);
            arrivalInput.sendKeys(trips[0].arrivalDate);
            departureInput.sendKeys(trips[0].departureDate);
            driver.wait(until.elementsLocated(By.className('checkbox-label')))
                .then(elements => elements.map(elem => {
                    elem.getText().then(text => {
                        if (text.indexOf(locations[0].city) > -1 || text.indexOf(locations[1].city) > -1) {
                            elem.click();
                        }
                    })
                }));
            addButton.click();
        })
        .then(() => driver.wait(until.elementLocated(By.partialLinkText('Customers'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.linkText('Add new customer'))))
        .then(element => element.click())
        .then(() => driver.wait(until.elementLocated(By.css('form'))))
        .then(() => LocationModel.find({}))
        .then((addedLocations) => {
            const firstNameInput = driver.findElement(By.id('firstName'));
            const lastNamelInput = driver.findElement(By.id('lastName'));
            const addButton = driver.findElement(By.className('btn-primary'));
            firstNameInput.sendKeys(customers[0].firstName);
            lastNamelInput.sendKeys(customers[0].lastName);
            driver.wait(until.elementsLocated(By.className('checkbox-label')))
                .then(elements => elements.map(elem => {
                    elem.getText().then(text => {
                        if (text.indexOf(trips[0].name) > -1) {
                            elem.click();
                        }
                    })
                }));
            addButton.click();
        })
        .then(() => Promise.all([LocationModel.find({}), TripModel.find({}), CustomerModel.find({})]))
        .then(([receivedLocations, receivedTrips, receivedCustomers]) => {
            expect(receivedLocations.map(transform)).toMatchObject(locations);
            expect(receivedTrips[0].name).toBe(trips[0].name);
            expect(receivedTrips[0].route.locations.length).toBe(2);
            expect(receivedCustomers[0].firstName).toBe(customers[0].firstName);
            expect(receivedCustomers[0].lastName).toBe(customers[0].lastName);
            expect(receivedCustomers[0].trips.length).toBe(1);
        })
        .then(() => driver.quit());
});
