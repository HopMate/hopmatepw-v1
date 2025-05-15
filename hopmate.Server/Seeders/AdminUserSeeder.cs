using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Identity;

namespace hopmate.Server.Seeders
{
	public static class AdminUserSeeder
	{
		public static async Task SeedAsync(
			UserManager<ApplicationUser> userManager,
			IConfiguration configuration)
		{
			var adminEmail = configuration["AdminCredentials:Email"];
			var adminPassword = configuration["AdminCredentials:Password"];

			if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
				return;

			if (await userManager.FindByEmailAsync(adminEmail) == null)
			{
				var user = new ApplicationUser
				{
					UserName = adminEmail,
					Email = adminEmail,
					FullName = "Admin",
					DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-25))
				};

				var result = await userManager.CreateAsync(user, adminPassword);

				if (result.Succeeded)
				{
					await userManager.AddToRoleAsync(user, "Admin");
				}
			}
		}
	}
}
