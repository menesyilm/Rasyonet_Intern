using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.DTOs;

namespace Rasyonet_Intern.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FonsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public FonsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> FonList()
        {
            var fonList = await _context.fonPerformanslar
                .Include(x => x.FonKategori)
                .ToListAsync();

            var mappedFonList = _mapper.Map<List<FonPerformansDto>>(fonList);
            return Ok(mappedFonList);
        }
    }
}
