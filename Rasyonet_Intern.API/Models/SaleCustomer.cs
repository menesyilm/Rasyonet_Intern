using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Models
{
    public class SaleCustomer
    {
        [BsonElement("gender")]
        public string Gender { get; set; } = string.Empty;

        [BsonElement("age")]
        public int Age { get; set; }

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("satisfaction")]
        public int Satisfaction { get; set; }
    }
}