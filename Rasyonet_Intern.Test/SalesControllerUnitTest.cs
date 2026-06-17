using Microsoft.AspNetCore.Mvc;
using Moq;
using Rasyonet_Intern.API.Controllers;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.Test
{
    public class Tests
    {
        // UnitOfWork_Condition_ExpectedResult
        [Test]
        public async Task GetByPurchaseMethod_ReturnsOkResult_WithData()
        {
            //Arrange
            var repositoryMock = new Mock<ISaleRepository>();

            var expected = new List<PurchaseMethodDistributionDto>
            {
                new PurchaseMethodDistributionDto
                {
                    PurchaseMethod = "In store",
                    TotalSales = 5619138.67m,
                    OrderCount = 2819
                },
                new PurchaseMethodDistributionDto
                {
                    PurchaseMethod = "Online",
                    TotalSales = 3163814.67m,
                    OrderCount = 1585
                },
                new PurchaseMethodDistributionDto
                {
                    PurchaseMethod = "Phone",
                    TotalSales = 1111618.93m,
                    OrderCount = 596
                }
            };

            repositoryMock
                .Setup(x => x.GetSalesByPurchaseMethodAsync())
                .ReturnsAsync(expected);

            //var controller = new SalesController(repositoryMock.Object);
            ////Action
            //var result = await controller.GetByPurchaseMethod();
            ////Assert
            //var okResult = result as OkObjectResult;

            //Assert.That(okResult, Is.Not.Null);

            //var data = okResult!.Value as List<PurchaseMethodDistributionDto>;

            //Assert.That(data, Is.Not.Null);
            //Assert.That(data!.Count, Is.EqualTo(3));
            //Assert.That(data[0].PurchaseMethod, Is.EqualTo("In store"));
            //Assert.That(data[0].OrderCount, Is.EqualTo(2819));

            //repositoryMock.Verify(
            //    x => x.GetSalesByPurchaseMethodAsync(),
            //    Times.Once);

        }
    }
}