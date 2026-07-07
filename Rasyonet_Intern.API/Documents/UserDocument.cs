using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Documents
{
    public class UserDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Surname { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string PasswordHash { get; set; } = String.Empty;    // Şifrenin kendisini değil, hashlenmiş halini tutacağız.
        public DateTime CreatedAt { get; set; }
    }
}
