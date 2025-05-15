/**
 * @file JwtService.cs
 * @brief Service for handling JWT authentication and token generation.
 */

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using hopmate.Server.Data;
using hopmate.Server.DTO.Auth;
using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace hopmate.Server.Services
{
	public class JwtService
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly JwtSettings _jwtSettings;
		private readonly ApplicationDbContext _dbContext;

		public JwtService(
			UserManager<ApplicationUser> userManager,
			IOptions<JwtSettings> jwtSettings,
			ApplicationDbContext dbContext)
		{
			_userManager = userManager;
			_jwtSettings = jwtSettings.Value;
			_dbContext = dbContext;
		}

		public async Task<AuthResponse> GenerateTokenAsync(ApplicationUser user)
		{
			var userRoles = await _userManager.GetRolesAsync(user);

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Guid to string
				new Claim(JwtRegisteredClaimNames.Sub, user.Email),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
			};

			foreach (var role in userRoles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role));
			}

			var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
			var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

			var jwtSecurityToken = new JwtSecurityToken(
				issuer: _jwtSettings.Issuer,
				audience: _jwtSettings.Audience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
				signingCredentials: signingCredentials);

			var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

			var refreshToken = GenerateRefreshToken();

			var refreshTokenEntity = new RefreshToken
			{
				UserId = user.Id,
				Token = refreshToken,
				ExpiryDate = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenDurationInDays),
				IsUsed = false,
				IsRevoked = false
			};

			_dbContext.RefreshTokens.Add(refreshTokenEntity);
			await _dbContext.SaveChangesAsync();

			return new AuthResponse
			{
				Token = token,
				RefreshToken = refreshToken,
				Expiration = jwtSecurityToken.ValidTo,
				Success = true,
				Roles = userRoles.ToList(),
				UserId = user.Id
			};
		}

		private string GenerateRefreshToken()
		{
			var randomNumber = new byte[64];
			using var rng = RandomNumberGenerator.Create();
			rng.GetBytes(randomNumber);
			return Convert.ToBase64String(randomNumber);
		}

		public async Task<AuthResponse> RefreshTokenAsync(string token, string refreshToken)
		{
			var principal = GetPrincipalFromExpiredToken(token);
			if (principal == null)
			{
				return new AuthResponse { Success = false, Message = "Invalid token" };
			}

			var email = principal.FindFirstValue(ClaimTypes.Email);
			var user = await _userManager.FindByEmailAsync(email);

			if (user == null)
			{
				return new AuthResponse { Success = false, Message = "User not found" };
			}

			// Find refresh token in database
			var storedRefreshToken = _dbContext.RefreshTokens
				.FirstOrDefault(x => x.Token == refreshToken && x.UserId == user.Id);

			if (storedRefreshToken == null)
			{
				return new AuthResponse { Success = false, Message = "Invalid refresh token" };
			}

			if (storedRefreshToken.ExpiryDate < DateTime.UtcNow)
			{
				return new AuthResponse { Success = false, Message = "Refresh token expired" };
			}

			if (storedRefreshToken.IsUsed || storedRefreshToken.IsRevoked)
			{
				return new AuthResponse { Success = false, Message = "Refresh token is used or revoked" };
			}

			// Mark current refresh token as used
			storedRefreshToken.IsUsed = true;
			_dbContext.RefreshTokens.Update(storedRefreshToken);
			await _dbContext.SaveChangesAsync();

			// Generate new tokens
			return await GenerateTokenAsync(user);
		}

		private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
		{
			var tokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = false, // Validating an expired token
				ValidateIssuerSigningKey = true,
				ValidIssuer = _jwtSettings.Issuer,
				ValidAudience = _jwtSettings.Audience,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key))
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

			if (securityToken is not JwtSecurityToken jwtSecurityToken ||
				!jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
			{
				return null;
			}

			return principal;
		}
	}
}