/**
 * @file RefreshToken.cs
 * @brief Model representing a refresh token in the database.
 */

namespace hopmate.Server.Models.Auth
{
	public class RefreshToken
	{
		public int Id { get; set; }
		public Guid UserId { get; set; }
		public string Token { get; set; } = string.Empty;
		public DateTime ExpiryDate { get; set; }
		public bool IsUsed { get; set; }
		public bool IsRevoked { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}