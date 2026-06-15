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
        public FonsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> FonList()
        {
            var fonList = await _context.fonPerformanslar.
                Include(x => x.FonKategori)
                .Select(x => new FonPerformansDto
                {
                    FonPerformansId = x.FonPerformansId,
                    FonKodu = x.FonKodu,
                    FonAdi = x.FonAdi,
                    Buyukluk = x.Buyukluk,
                    Fiyat = x.Fiyat,
                    GunlukDegisimYuzde = x.GunlukDegisimYuzde,
                    HaftalikDegisimYuzde = x.HaftalikDegisimYuzde,
                    AylikDegisimYuzde = x.AylikDegisimYuzde,
                    KategoriAdi = x.FonKategori.KategoriAdi
                })
                .ToListAsync();
            return Ok(fonList);
        }
    }
}
