using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _repository;

        public CategoriesController(ICategoryRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetAllCategories()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("chart")]
        public async Task<IActionResult> GetChartData()
        {
            var result = await _repository.GetChartData();
            return Ok(result);
        }
    }
}
