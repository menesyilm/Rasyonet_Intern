using AutoMapper;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Mapping
{
    public class GeneralMapping : Profile
    {
        public GeneralMapping()
        {
            CreateMap<Performance, PerformanceDto>().ReverseMap();
        }
    }
}
