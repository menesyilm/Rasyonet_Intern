using AutoMapper;
using MongoDB.Driver;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.DTOs.Auth;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Services.Auth.Interfaces;

namespace Rasyonet_Intern.API.Services.Auth.Implementations
{
    public class AuthService : IAuthService
    {
        // Kullanıcı veritabanı işlemleri için repository.
        // MongoDB'ye doğrudan burada erişmek yerine IUserRepository kullanıyoruz.
        private readonly IUserRepository _userRepository;
        // Şifre hashleme ve şifre doğrulama işlemleri için servis.
        // AuthService şifrenin nasıl hash'lendiğini bilmez, sadece servisi çağırır.
        private readonly IPasswordService _passwordService;

        // JWT token üretmek için kullanılan servis.
        // Token oluşturma detayları AuthService içinde tutulmaz.
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepository, IPasswordService passwordService, IJwtTokenService jwtTokenService, IMapper mapper)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
        }

        // Sistemdeki tüm kullanıcıları getirir.
        public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
        {
            // Repository üzerinden MongoDB'deki tüm kullanıcılar çekiliyor.
            var users = await _userRepository.GetAllAsync();
            // UserDocument listesini UserResponseDto listesine çeviriyoruz.
            return _mapper.Map<List<UserResponseDto>>(users);
        }

        // Kullanıcının email ve şifre ile giriş yapmasını sağlar.
        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Email normalize ediliyor.
            var normalizedEmail = request.Email.Trim().ToLower();
            // Normalize edilmiş email ile kullanıcı aranıyor.
            var user = await _userRepository.GetByEmailAsync(normalizedEmail);
            // Kullanıcı bulunamadıysa güvenlik için genel hata dönülür.

            // "Email yanlış" veya "şifre yanlış" diye ayrı ayrı söylemek doğru değildir.
            if (user is null)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");
            // Girilen şifre, kullanıcının kayıtlı PasswordHash değeriyle karşılaştırılıyor.
            var passwordValid = _passwordService.VerifyPassword(user, request.Password);
            // Şifre yanlışsa yine aynı genel hata veriliyor.
            if (!passwordValid)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");
            // Kullanıcı doğrulandıktan sonra JWT token oluşturuluyor.
            // expiresAt token'ın ne zaman geçersiz olacağını temsil eder.
            var token = _jwtTokenService.GenerateToken(user, out var expiresAt);
            // Token, expire tarihi ve kullanıcı bilgisi response olarak dönülür.
            return CreateAuthResponse(user, token, expiresAt);
        }

        // Yeni kullanıcı kaydı oluşturur.
        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Email normalize ediliyor.
            var normalizedEmail = request.Email.Trim().ToLower();
            // Aynı email daha önce kullanılmış mı kontrol ediliyor.
            var emailExists = await _userRepository.ExistsByEmailAsync(normalizedEmail);
            // Email zaten varsa kayıt işlemine izin verilmez.
            if (emailExists)
                throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");
            // RegisterRequestDto'dan UserDocument oluşturuluyor.
            // Yani client'tan gelen DTO, MongoDB'de tutulacak document'e çevriliyor.
            var user = _mapper.Map<UserDocument>(request);
            // Normalize edilmiş email document'e set ediliyor.
            user.Email = normalizedEmail;
            // Kullanıcının düz şifresi asla veritabanına kaydedilmez.
            // Bunun yerine hashlenmiş hali kaydedilir.
            user.PasswordHash = _passwordService.HashPassword(user, request.Password);

            try
            {
                // Yeni kullanıcı MongoDB'ye kaydediliyor.
                await _userRepository.CreateAsync(user);
            }
            catch (MongoWriteException ex) when
                (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
            {
                // Aynı email için unique index varsa ve aynı anda iki kayıt isteği gelirse,
                // ilk ExistsByEmailAsync kontrolünden geçse bile MongoDB duplicate hatası verebilir.
                // Bu catch bloğu race condition'a karşı ek güvenlik sağlar.
                throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");
            }
            // Kayıt başarılı olduktan sonra kullanıcıya direkt token üretiliyor.
            // Böylece register sonrası tekrar login yaptırmadan sisteme alınabilir.
            var token = _jwtTokenService.GenerateToken(user, out var expiresAt);
            // Token, expire tarihi ve kullanıcı bilgisi response olarak dönülür.
            return CreateAuthResponse(user, token, expiresAt);
        }
        // Login ve Register metodları aynı response yapısını döndüğü için
        // tekrar eden kodu buraya aldık.
        private AuthResponseDto CreateAuthResponse(UserDocument user, string token, DateTime expiresAt)
        {
            return new AuthResponseDto
            {
                // Mobil veya frontend tarafında kullanılacak JWT token.
                AccessToken = token,
                // Token'ın geçerlilik süresi.
                ExpiresAt = expiresAt,
                // Kullanıcı bilgileri.
                // Burada PasswordHash kesinlikle dönülmemeli.
                User = _mapper.Map<UserResponseDto>(user)
            };
        }
    }
}
