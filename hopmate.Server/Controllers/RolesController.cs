/**
 * @file RolesController.cs
 * @brief Controller for managing user roles.
 */

using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Roles = "Admin")]
	public class RolesController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;

		public RolesController(
			UserManager<ApplicationUser> userManager,
			RoleManager<IdentityRole> roleManager)
		{
			_userManager = userManager;
			_roleManager = roleManager;
		}

		[HttpGet]
		public IActionResult GetRoles()
		{
			var roles = _roleManager.Roles.Select(r => r.Name).ToList();
			return Ok(roles);
		}

		[HttpPost]
		public async Task<IActionResult> CreateRole([FromBody] string roleName)
		{
			if (string.IsNullOrWhiteSpace(roleName))
			{
				return BadRequest("Role name cannot be empty");
			}

			var roleExists = await _roleManager.RoleExistsAsync(roleName);
			if (roleExists)
			{
				return BadRequest($"Role '{roleName}' already exists");
			}

			var result = await _roleManager.CreateAsync(new IdentityRole(roleName));

			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(e => e.Description).ToList();
				return BadRequest(string.Join(", ", errors));
			}

			return Ok(new { message = $"Role '{roleName}' created successfully" });
		}

		[HttpPost("assign")]
		public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest model)
		{
			var user = await _userManager.FindByIdAsync(model.UserId);
			if (user == null)
			{
				return NotFound($"User with ID '{model.UserId}' not found");
			}

			var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
			if (!roleExists)
			{
				return BadRequest($"Role '{model.RoleName}' does not exist");
			}

			var result = await _userManager.AddToRoleAsync(user, model.RoleName);

			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(e => e.Description).ToList();
				return BadRequest(string.Join(", ", errors));
			}

			return Ok(new { message = $"Role '{model.RoleName}' assigned to user successfully" });
		}

		[HttpPost("remove")]
		public async Task<IActionResult> RemoveRole([FromBody] AssignRoleRequest model)
		{
			var user = await _userManager.FindByIdAsync(model.UserId);
			if (user == null)
			{
				return NotFound($"User with ID '{model.UserId}' not found");
			}

			var isInRole = await _userManager.IsInRoleAsync(user, model.RoleName);
			if (!isInRole)
			{
				return BadRequest($"User is not in role '{model.RoleName}'");
			}

			var result = await _userManager.RemoveFromRoleAsync(user, model.RoleName);

			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(e => e.Description).ToList();
				return BadRequest(string.Join(", ", errors));
			}

			return Ok(new { message = $"Role '{model.RoleName}' removed from user successfully" });
		}
	}

	public class AssignRoleRequest
	{
		public string UserId { get; set; } = string.Empty;
		public string RoleName { get; set; } = string.Empty;
	}
}