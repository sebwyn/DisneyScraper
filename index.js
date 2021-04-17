const puppeteer = require('puppeteer');


async function run() {
    const browser = await puppeteer.launch({ headless: false});
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://disneyworld.disney.go.com/availability-calendar/?segments=tickets,resort,passholder&amp;defaultSegment=tickets');

    //run code to change the month
    await page.evaluate( async () => {
        //navigate through shadow roots manually
        let calendar = document.querySelector("awakening-calendar").shadowRoot.querySelector("wdat-calendar").shadowRoot;
        let month = calendar.querySelector("#monthHeader");
    
        if(month.innerHTML == "April"){
            //go to the next month
            let nextButton = calendar.querySelector("#nextArrow");
            nextButton.click(); 
        }
    });
    //wait a second for the month to update
    await new Promise(r => setTimeout(r, 1000));

    var date = new Date();
    console.log(date.toString());
      
    async function getAvailability(day){
        var data = [];

        let calendar = document.querySelector("awakening-calendar").shadowRoot.querySelector("wdat-calendar").shadowRoot;
        let date = calendar.querySelector('wdat-date[date="2021-05-' + String(day) + '"]'); 
        date.click();

        //wait for it to load
        await new Promise(r => setTimeout(r, 1000));

        //get the availability info
        let selectedDay = document.querySelector("awakening-availability-information").shadowRoot
        let dayString = selectedDay.querySelector(".selectedDate").innerHTML;
        data.push(dayString);

        let availabilities = selectedDay.querySelector("#parkAvailabilityContainer");
        let parks = availabilities.getElementsByTagName("div"); 
        for(const park of parks){
            if(park.classList.contains("available")){
                data.push(true);
            } else {
                data.push(false);
            }
        }

        return data;
    }

    console.log(await page.evaluate(getAvailability, 20));
    console.log(await page.evaluate(getAvailability, 21));
    console.log(await page.evaluate(getAvailability, 22));
    console.log(await page.evaluate(getAvailability, 23));
    console.log(await page.evaluate(getAvailability, 24));
    console.log(await page.evaluate(getAvailability, 25));
}

run();
