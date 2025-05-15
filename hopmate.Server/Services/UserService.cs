/**
 * @file UserService.cs
 * @brief Service for handling user-related operations.
 */

using System.Security.Claims;
using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Identity;

namespace hopmate.Server.Services
{
	public class UserService
	{
		private readonly UserManager<ApplicationUser> _userManager;

		public UserService(UserManager<ApplicationUser> userManager)
		{
			_userManager = userManager;
		}

		public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
		{
			return await _userManager.FindByIdAsync(userId);
		}

		public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
		{
			return await _userManager.FindByEmailAsync(email);
		}

		public async Task<ApplicationUser?> GetCurrentUserAsync(ClaimsPrincipal userClaims)
		{
			var userId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
			if (string.IsNullOrEmpty(userId))
			{
				return null;
			}

			return await GetUserByIdAsync(userId);
		}

		public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
		{
			return await _userManager.GetRolesAsync(user);
		}

		public async Task<bool> UpdateUserProfileAsync(string userId, string fullName, DateOnly dateOfBirth)
		{
			var user = await GetUserByIdAsync(userId);
			if (user == null)
			{
				return false;
			}

			user.FullName = fullName;
			user.DateOfBirth = dateOfBirth;

			var result = await _userManager.UpdateAsync(user);
			return result.Succeeded;
		}
	}
}