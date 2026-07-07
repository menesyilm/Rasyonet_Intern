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
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepository, IPasswordService passwordService, IJwtTokenService jwtTokenService, IMapper mapper)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<List<UserResponseDto>>(users);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            var user = await _userRepository.GetByEmailAsync(normalizedEmail);

            if (user is null)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");

            var passwordValid = _passwordService.VerifyPassword(user, request.Password);

            if (!passwordValid)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");

            var token = _jwtTokenService.GenerateToken(user, out var expiresAt);

            return CreateAuthResponse(user, token, expiresAt);
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            var emailExists = await _userRepository.ExistsByEmailAsync(normalizedEmail);

            if (emailExists)
                throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");

            var user = _mapper.Map<UserDocument>(request);
            user.Email = normalizedEmail;
            user.PasswordHash = _passwordService.HashPassword(user, request.Password);

            try
            {
                await _userRepository.CreateAsync(user);
            }
            catch (MongoWriteException ex) when
                (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
            {
                throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");
            }

            var token = _jwtTokenService.GenerateToken(user, out var expiresAt);

            return CreateAuthResponse(user, token, expiresAt);
        }

        private AuthResponseDto CreateAuthResponse(UserDocument user, string token, DateTime expiresAt)
        {
            return new AuthResponseDto
            {
                AccessToken = token,
                ExpiresAt = expiresAt,
                User = _mapper.Map<UserResponseDto>(user)
            };
        }
    }
}
