using Microsoft.AspNetCore.Mvc;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Repository;

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }
    }
}