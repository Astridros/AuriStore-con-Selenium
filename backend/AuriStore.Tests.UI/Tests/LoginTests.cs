using OpenQA.Selenium.Support.UI;
using AuriStore.UI.Tests.Base;
using AuriStore.UI.Tests.Pages;
using System;

namespace AuriStore.UI.Tests.Tests
{
    public class LoginTests : BaseTest
    {
        [Test]
        public void Login_CaminoFeliz()
        {
            var loginPage = new LoginPage(driver!);

            string email = "roselin@gmail.com";
            string password = "1234567";

            loginPage.Login(email, password);

            WebDriverWait wait = new WebDriverWait(driver!, TimeSpan.FromSeconds(10));

            bool loginCorrecto = false;

            try
            {
                loginCorrecto = wait.Until(driver =>
                    driver.Url.Contains("admin.html") ||
                    driver.PageSource.Contains("Panel Administrativo") ||
                    driver.PageSource.Contains("Dashboard") ||
                    driver.PageSource.Contains("Gestión de Usuarios") ||
                    driver.PageSource.Contains("AuriStore")
                );
            }
            catch (Exception)
            {
                loginCorrecto = false;
            }

            Console.WriteLine("URL actual: " + driver!.Url);

            Assert.IsTrue(loginCorrecto, "Selenium NO detectó la navegación hacia el panel administrador.");
        }
    }
}
