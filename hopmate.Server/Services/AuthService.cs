/**
 * @file AuthService.cs
 * @brief Service for handling authentication logic.
 */


using hopmate.Server.Data;
using hopmate.Server.DTO.Auth;
using hopmate.Server.Models;
using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Identity;

namespace hopmate.Server.Services
{
	public class AuthService
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly SignInManager<ApplicationUser> _signInManager;
		private readonly RoleManager<IdentityRole<Guid>> _roleManager; // Fixed: Use generic IdentityRole<Guid>
		private readonly JwtService _jwtService;
		private readonly ApplicationDbContext _dbContext;

		public AuthService(
			UserManager<ApplicationUser> userManager,
			SignInManager<ApplicationUser> signInManager,
			RoleManager<IdentityRole<Guid>> roleManager, // Fixed: Use generic IdentityRole<Guid>
			JwtService jwtService,
			ApplicationDbContext dbContext)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_roleManager = roleManager;
			_jwtService = jwtService;
			_dbContext = dbContext;
		}

		public async Task<AuthResponse> RegisterAsync(RegisterRequest model)
		{
			var userExists = await _userManager.FindByEmailAsync(model.Email);
			if (userExists != null)
			{
				return new AuthResponse { Success = false, Message = "User already exists" };
			}

			var user = new ApplicationUser
			{
				UserName = model.Email,
				DateOfBirth = model.DateOfBirth,
				Email = model.Email,
				FullName = model.FullName,
				SecurityStamp = Guid.NewGuid().ToString()
			};

			var result = await _userManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(e => e.Description).ToList();
				return new AuthResponse { Success = false, Message = string.Join(", ", errors) };
			}

			try
			{
				// Criar Passenger
				var passenger = new Passenger
				{
					IdUser = user.Id,
					User = user
				};
				_dbContext.Passengers.Add(passenger);

				// Criar Driver
				var driver = new Driver
				{
					IdUser = user.Id,
					User = user
				};
				_dbContext.Drivers.Add(driver);

				await _dbContext.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				// Se algo der errado, deletar o usuário criado
				await _userManager.DeleteAsync(user);
				return new AuthResponse { Success = false, Message = $"Failed to create passenger/driver records: {ex.Message}" };
			}

			await _userManager.AddToRoleAsync(user, "User");
			return await _jwtService.GenerateTokenAsync(user);
		}

		public async Task<AuthResponse> LoginAsync(LoginRequest model)
		{
			var user = await _userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				return new AuthResponse { Success = false, Message = "Invalid credentials" };
			}

			var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
			if (!result.Succeeded)
			{
				return new AuthResponse { Success = false, Message = "Invalid credentials" };
			}

			return await _jwtService.GenerateTokenAsync(user);
		}

		public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest model)
		{
			return await _jwtService.RefreshTokenAsync(model.Token, model.RefreshToken);
		}
	}
}