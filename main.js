const puppeteer = require('puppeteer');

//usamos estos dos variables para iterar por las paginas que tiene la web
const URL = 'https://www.madrid.es/portales/munimadrid/es/Inicio/Buscador?vgnextoid=d4cade31bd2ac410VgnVCM100000171f5a0aRCRD&vgnextchannel=d4cade31bd2ac410VgnVCM100000171f5a0aRCRD&action=es.iam.portlet.buscador.SearchAction&advanced=true&type=EntidadesYOrganismos&q=parques&hq=more%3Apagemap%3Ametatags-wt.cg_s%3AEntidadesYOrganismos';

let cont = 1;

(async function () {

    //abreme el navegador
    //(headless en true hace que no se abra la pagina web, it runs in 'headless mode' - no UI interface)
    const browser = await puppeteer.launch({
        headless: false
    });

    //en el navegador abreme una nueva pestaña
    const page = await browser.newPage();

    //ves a esta URL
    //con esto: `${URL}&start=${cont}`; podemos iterar por todas la paginas que tiene la web
    await page.goto(`${URL}&start=${cont}`);

    //espera a que este selector aparezca (si esta este selector, estan todos los datos cargados) y luego continua
    await page.waitForSelector('.search_result_container');

    //hace una captura de pantalla y nos la enseña, asi podemos ver si accedemos a la info que queremos.
    //await page.screenshot({ path: 'example.png' });

    //devuelve todos los selectores li con clase result-container
    let busqueda = await page.$$('li.result-container');

    //hacemos un cosole.log de busqueda.length para ver si coincide con la cantidad de elementos que enseña la web. (conincide)
    //console.log(busqueda.length);

    let hrefParques = [];

    for (let i = 0; i < busqueda.length; i++) {
        //$eval = que etiqueta quieres evaluar, la funcion anonima nos dice que devolvemos y trim() quita los espacios delante y detras de los string
        let href = await busqueda[i].$eval('a', a => a.href.trim());
        hrefParques.push(href);
    }

    //iteramos por los href obtenidos de los distintos parques, para acceder a sus datos
    for (let i = 0; i < hrefParques.length; i++) {
        let parque = {};

        await page.goto(hrefParques[i]);

        await page.waitForSelector('div.container');

        parque.title = await page.$eval('h3.summary-title', h3 => h3.innerText.trim());

        parque.descripcion = await page.$eval('.tiny-text', div => div.innerText.trim());

        parque.imagen = await page.$eval('.mainContent img:first-child', img => img.src.trim());

        parque.direccion = await page.$eval('dl.dl-horz.adr dd', dd => dd.innerText.trim().toLowerCase());

        //para recoger datos consistentes... – habia un parque que devolvía la dirección para el campo barrio. Arreglamos el problema usando 'last-of-type', y diciendole que si existe la última etiqueta dt y empieza por 'barrio', guardamos la siguiente etiqueta que sale (dd) que tiene la info del barrio, y si no existe, que se quede el campo con 'N/A'.
        if ((await page.$eval('dl.adr dt:last-of-type', dt => dt.innerText.trim())).toLowerCase().startsWith('barrio')) {
            parque.barrio = await page.$eval('dl.adr dd:last-of-type', dd => dd.innerText.trim().toLowerCase())
        } else {
            parque.barrio = 'N/A'
        }

        parque.comoLlegar = await page.$eval('#comoLlegar .tiny-text', div => div.innerText.trim());

        let servicios = await page.$$('#servicios .tiny-text ul li')

        parque.servicios = []
        for (let i = 0; i < servicios.length; i++) {
            let serv = await page.evaluate(elem => elem.textContent.trim(), servicios[i])
            parque.servicios.push(serv)
        }

        //para ver que estamos recogiendo toda la info
        console.log(parque);

        //esto lo podemos quitar y el scraping tardará menos
        //await page.waitFor(2000);
    };

    //cierra la página
    await browser.close();

})();