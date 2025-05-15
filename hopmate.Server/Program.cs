/**
 * @file Program.cs
 * @brief Main entry point for the ASP.NET Core application.
 */

using System.Text;
using hopmate.Server.Data;
using hopmate.Server.Models.Auth;
using hopmate.Server.Seeders;
using hopmate.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

namespace hopmate.Server
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.
			builder.Services.AddControllers();

			builder.Services.AddDbContext<ApplicationDbContext>(options =>
				options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
					sqlServerOptionsAction: sqlOptions =>
					{
						sqlOptions.EnableRetryOnFailure(
							maxRetryCount: 5,
							maxRetryDelay: TimeSpan.FromSeconds(30),
							errorNumbersToAdd: null);
					}));

			// Configure Identity
			builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
			{
				// Password settings
				options.Password.RequireDigit = true;
				options.Password.RequireLowercase = true;
				options.Password.RequireUppercase = true;
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequiredLength = 8;

				// Lockout settings
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
				options.Lockout.MaxFailedAccessAttempts = 5;

				// User settings
				options.User.RequireUniqueEmail = true;
			})
			.AddEntityFrameworkStores<ApplicationDbContext>()
			.AddDefaultTokenProviders();

			// Configure JWT
			builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
			var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

			builder.Services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = jwtSettings.Issuer,
					ValidAudience = jwtSettings.Audience,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
					ClockSkew = TimeSpan.Zero
				};

				options.Events = new JwtBearerEvents
				{
					OnAuthenticationFailed = context =>
					{
						if (context.Exception is SecurityTokenExpiredException)
						{
							context.Response.Headers.Append("Token-Expired", "true");
						}
						return Task.CompletedTask;
					}
				};
			});

			// Add Authorization Policies
			builder.Services.AddAuthorizationBuilder()
					.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"))
					.AddPolicy("RequireUserRole", policy => policy.RequireRole("User"))
					.AddPolicy("RequireDriverRole", policy => policy.RequireRole("Driver"));

			// Register Services
			builder.Services.AddScoped<JwtService>();
			builder.Services.AddScoped<AuthService>();
			builder.Services.AddScoped<UserService>();
			builder.Services.AddScoped<IColorService, ColorService>();
			builder.Services.AddScoped<IVehicleService, VehicleService>();
			builder.Services.AddHttpContextAccessor();

			// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
			builder.Services.AddOpenApi("v1", options => { options.AddDocumentTransformer<BearerSecuritySchemeTransformer>(); });
			builder.Services.AddEndpointsApiExplorer();

			// Add CORS
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowReactApp", policy =>
				{
					policy.WithOrigins("https://localhost:23052") // Your React app's URL
						.AllowAnyMethod()
						.AllowAnyHeader()
						.AllowCredentials();
				});
			});

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.MapOpenApi();
				app.MapScalarApiReference(options =>
				{
					options
						.WithTitle("Demo Api")
						.WithTheme(ScalarTheme.Mars)
						.WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
				});
			}
			else
			{
				app.UseExceptionHandler("/Error");
				app.UseHsts();
			}

			app.UseDefaultFiles();
			app.MapStaticAssets();

			app.UseHttpsRedirection();
			app.UseStaticFiles();

			// Use CORS
			app.UseCors("AllowReactApp");

			app.UseAuthentication();
			app.UseAuthorization();

			app.MapControllers();
			app.MapFallbackToFile("/index.html");

			// Seed default roles
			// Before seeding roles, ensure the database exists
			using (var scope = app.Services.CreateScope())
			{
				var services = scope.ServiceProvider;
				var dbContext = services.GetRequiredService<ApplicationDbContext>();
				dbContext.Database.EnsureCreated();

				// Update: Fixed RoleSeeder for generic IdentityRole<Guid>
				await RoleSeeder.SeedAsync(services.GetRequiredService<RoleManager<IdentityRole<Guid>>>());
				await AdminUserSeeder.SeedAsync(
					services.GetRequiredService<UserManager<ApplicationUser>>(),
					builder.Configuration);
				await ColorSeeder.SeedAsync(dbContext);
			}

			app.Run();
		}
	}
}