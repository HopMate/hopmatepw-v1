using Microsoft.AspNetCore.Identity;

namespace hopmate.Server.Seeders
{
	public static class RoleSeeder
	{
		public static async Task SeedAsync(RoleManager<IdentityRole<Guid>> roleManager)
		{
			string[] roles = { "Admin", "User", "Driver" };

			foreach (var role in roles)
			{
				if (!await roleManager.RoleExistsAsync(role))
				{
					await roleManager.CreateAsync(new IdentityRole<Guid>(role));
				}
			}
		}
	}
}