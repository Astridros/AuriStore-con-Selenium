using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace AuriStore.UI.Tests.Base
{
    public class BaseTest
    {
        protected IWebDriver driver;

        protected string baseUrl = "http://127.0.0.1:5500/html/auth.html";

        [SetUp]
        public void SetUp()
        {
            var options = new ChromeOptions();
            options.AddArgument("--start-maximized");

            driver = new ChromeDriver(options);
            driver.Navigate().GoToUrl(baseUrl);
        }

        [TearDown]
        public void TearDown()
        {
            driver.Quit();
        }
    }
}

