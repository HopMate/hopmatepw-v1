/**
 * @file AuthDTO.cs
 * @brief Data Transfer Objects for authentication-related requests and responses.
 */

using System.ComponentModel.DataAnnotations;
using hopmate.Server.Interfaces;

namespace hopmate.Server.DTO.Auth
{
	public class RegisterRequest :
		IEmailValidation,
		IPasswordValidation,
		IUserProfileValidation
	{
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string FullName { get; set; } = string.Empty;
		public DateOnly DateOfBirth { get; set; }
	}

	public class LoginRequest
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; } = string.Empty;

		[Required]
		public string Password { get; set; } = string.Empty;
	}

	public class AuthResponse
	{
		public string Token { get; set; } = string.Empty;
		public string RefreshToken { get; set; } = string.Empty;
		public DateTime Expiration { get; set; }
		public bool Success { get; set; }
		public string? Message { get; set; }
		public List<string> Roles { get; set; } = new List<string>();
		public Guid UserId { get; set; }
	}

	public class RefreshTokenRequest
	{
		[Required]
		public string Token { get; set; } = string.Empty;

		[Required]
		public string RefreshToken { get; set; } = string.Empty;
	}
}