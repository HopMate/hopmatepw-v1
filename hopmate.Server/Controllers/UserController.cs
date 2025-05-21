using hopmate.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class UserController : ControllerBase
	{
		private readonly UserService _userService;

		public UserController(UserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		public async Task<IActionResult> GetUser()
		{
			var user = await _userService.GetCurrentUserAsync(User);
			if (user == null)
			{
				return NotFound();
			}

			return Ok(new
			{
				id = user.Id,                  // <-- Added this line to include user ID
				fullName = user.FullName,
				email = user.Email,
				dateOfBirth = user.DateOfBirth.ToString("yyyy-MM-dd")
			});
		}

		[HttpPut("profile")]
		public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
		{
			var user = await _userService.GetCurrentUserAsync(User);
			if (user == null)
			{
				return Unauthorized();
			}

			var success = await _userService.UpdateUserProfileAsync(
				user.Id.ToString(), // Convert Guid to string if needed
				request.FullName,
				request.DateOfBirth
			);

			if (!success)
			{
				return BadRequest("Failed to update profile");
			}

			return Ok();
		}
	}
}

public class UpdateProfileRequest
{
	public required string FullName { get; set; }
	public required DateOnly DateOfBirth { get; set; }
}