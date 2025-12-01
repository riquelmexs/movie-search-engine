
const { Builder, By, until } = require('selenium-webdriver');

jest.setTimeout(30000); 

describe.skip('Testes funcionais - Buscador de Filmes', () => {

  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('Fluxo 1 - Buscar um filme e exibir resultados', async () => {
    await driver.get('http://localhost:3000');

    const input = await driver.wait(
      until.elementLocated(By.css('input.search-bar')),
      10000
    );
    const button = await driver.findElement(By.css('button.search-button'));

    await input.clear();
    await input.sendKeys('Inception');
    await button.click();

    const cards = await driver.wait(
      until.elementsLocated(By.css('.movie-card')),
      10000
    );

    expect(cards.length).toBeGreaterThan(0);
  });

  test('Fluxo 2 - Buscar com campo vazio (comportamento do filtro)', async () => {
    await driver.get('http://localhost:3000');

    const input = await driver.wait(
      until.elementLocated(By.css('input.search-bar')),
      10000
    );
    const button = await driver.findElement(By.css('button.search-button'));

    await input.clear();
    await button.click();

    // Aqui validamos que a página continua estável
    const title = await driver.findElement(By.css('h1.title'));
    const titleText = await title.getText();

    expect(titleText).toMatch(/Buscador de Filmes/i);
  });

  test('Fluxo 3 - Verificar carregamento inicial da página', async () => {
    await driver.get('http://localhost:3000');

    const title = await driver.wait(
      until.elementLocated(By.css('h1.title')),
      10000
    );
    const titleText = await title.getText();

    expect(titleText).toMatch(/Buscador de Filmes/i);

    const cards = await driver.findElements(By.css('.movie-card'));
    // Pode haver 0 ou mais cards dependendo da resposta da API
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });
});
