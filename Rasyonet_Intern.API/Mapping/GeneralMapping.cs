using AutoMapper;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Entities;

namespace Rasyonet_Intern.API.Mapping
{
    public class GeneralMapping : Profile
    {
        public GeneralMapping()
        {
            CreateMap<Category, CategoryDocument>()
                .ForMember(dest => dest.SqlId, opt => opt.MapFrom(src => src.Id));

            CreateMap<Performance, PerformanceDocument>();

            CreateMap<Sale, SaleDocument>()
                .ForMember(dest => dest.SqlId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.SaleItems))
                .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.SaleCustomer));

            CreateMap<SaleCustomer, SaleCustomerDocument>();

            CreateMap<SaleItem, SaleItemDocument>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                    string.IsNullOrWhiteSpace(src.Tags)
                        ? new List<string>()
                        : src.Tags.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).ToList()));
        }
    }
}
