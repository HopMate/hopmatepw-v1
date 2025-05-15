/** 
 * @file AuthController.cs
 * @brief Controller for handling authentication-related requests.
 */

using hopmate.Server.DTO.Auth;
using hopmate.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AuthService _authService;

		public AuthController(AuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequest model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var result = await _authService.RegisterAsync(model);
			return result.Success ? Ok(result) : BadRequest(result);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequest model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var result = await _authService.LoginAsync(model);
			return result.Success ? Ok(result) : BadRequest(result);
		}

		[HttpPost("refresh-token")]
		public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var result = await _authService.RefreshTokenAsync(model);
			return result.Success ? Ok(result) : BadRequest(result);
		}
	}
}