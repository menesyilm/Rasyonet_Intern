using AutoMapper;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Mapping
{
    public class GeneralMapping : Profile
    {
        public GeneralMapping()
        {
            CreateMap<FonPerformans, FonPerformansDto>().ForMember(dest => dest.KategoriAdi,opt => opt.MapFrom(src => src.FonKategori.KategoriAdi)).ReverseMap();
        }
    }
}
