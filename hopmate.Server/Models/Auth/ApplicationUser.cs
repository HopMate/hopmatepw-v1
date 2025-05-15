/**
 * @file ApplicationUser.cs
 * @brief Represents a user in the application with additional profile information.
 */

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using hopmate.Server.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace hopmate.Server.Models.Auth
{
	public class ApplicationUser : IdentityUser<Guid>, IUserProfileValidation
	{
		[PersonalData]
		[DataType(DataType.Text)]
		[Display(Name = "Full Name")]
		public required string FullName { get; set; }

		[PersonalData]
		[DataType(DataType.Date)]
		[Display(Name = "Date Of Birth")]
		public required DateOnly DateOfBirth { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public static ValidationResult? ValidateAdult(DateOnly dateOfBirth, ValidationContext context)
		{
			return dateOfBirth <= DateOnly.FromDateTime(DateTime.Today.AddYears(-18))
				? ValidationResult.Success
				: new ValidationResult("You must be at least 18 years old.");
		}
	}
}