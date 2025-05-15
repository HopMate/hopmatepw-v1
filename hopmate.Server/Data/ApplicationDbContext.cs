/**
 * @file ApplicationDbContext.cs
 * @brief Database context for the application.
 */

using hopmate.Server.Models;
using hopmate.Server.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Data
{
	public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}

		public DbSet<RefreshToken> RefreshTokens { get; set; }
		public DbSet<Passenger> Passengers { get; set; }
		public DbSet<Driver> Drivers { get; set; }
		public DbSet<Color> Colors { get; set; }
		public DbSet<Vehicle> Vehicles { get; set; }


		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<RefreshToken>(entity =>
			{
				entity.HasIndex(x => x.Token).IsUnique();
			});

			// Configure Passenger (1:1 with ApplicationUser)
			builder.Entity<Passenger>(entity =>
			{
				entity.HasKey(x => x.IdUser);
				entity.HasOne(p => p.User)
					  .WithOne()
					  .HasForeignKey<Passenger>(p => p.IdUser)
					  .OnDelete(DeleteBehavior.Cascade);
			});

			// Configure Driver (1:1 with ApplicationUser)
			builder.Entity<Driver>(entity =>
			{
				entity.HasKey(x => x.IdUser);
				entity.Property(x => x.DrivingLicense)
					  .HasMaxLength(50)
					  .IsRequired();

				entity.HasOne(d => d.User)
					  .WithOne()
					  .HasForeignKey<Driver>(d => d.IdUser)
					  .OnDelete(DeleteBehavior.Cascade);
			});

			// Configure Color
			builder.Entity<Color>(entity =>
			{
				entity.Property(x => x.Name)
					  .HasMaxLength(50)
					  .IsRequired();
			});

			// Configure Vehicle
			builder.Entity<Vehicle>(entity =>
			{
				entity.Property(x => x.Brand)
					  .HasMaxLength(50)
					  .IsRequired();

				entity.Property(x => x.Model)
					  .HasMaxLength(50)
					  .IsRequired();

				entity.Property(x => x.Plate)
					  .HasMaxLength(20)
					  .IsRequired();

				entity.Property(x => x.ImageFilePath)
					  .HasMaxLength(255);

				// Relationship with Driver
				entity.HasOne(x => x.Driver)
					  .WithMany() // Update this if you uncomment Vehicles collection in Driver
					  .HasForeignKey(x => x.IdDriver)
					  .OnDelete(DeleteBehavior.Restrict);

				// Relationship with Color
				entity.HasOne(x => x.Color)
					  .WithMany(x => x.Vehicles)
					  .HasForeignKey(x => x.IdColor)
					  .OnDelete(DeleteBehavior.Restrict);
			});

			// Customize Identity tables if needed
			builder.Entity<ApplicationUser>(entity =>
			{
				entity.Property(x => x.FullName)
					  .HasMaxLength(100);

				entity.Property(x => x.DateOfBirth)
					  .HasColumnType("date");
			});
		}
	}
}