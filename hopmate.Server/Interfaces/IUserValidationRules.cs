/**
 * @file IUserValidationRules.cs
 * @brief Interface for user validation rules.
 */

using System.ComponentModel.DataAnnotations;

namespace hopmate.Server.Interfaces
{
	public interface IEmailValidation
	{
		[Required(ErrorMessage = "Email is required.")]
		[EmailAddress(ErrorMessage = "Invalid email format.")]
		string Email { get; set; }
	}

	public interface IPasswordValidation
	{
		[Required(ErrorMessage = "Password is required.")]
		[StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters.")]
		string Password { get; set; }
	}

	public interface IUserProfileValidation
	{
		[Required(ErrorMessage = "Full name is required.")]
		[StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be 2-100 characters.")]
		string FullName { get; set; }

		[Required(ErrorMessage = "Date of birth is required.")]
		[CustomValidation(typeof(AdultValidation), nameof(AdultValidation.ValidateAdult))]
		DateOnly DateOfBirth { get; set; }
	}

	public static class AdultValidation
	{
		public static ValidationResult? ValidateAdult(DateOnly dateOfBirth)
			=> dateOfBirth <= DateOnly.FromDateTime(DateTime.Today.AddYears(-18))
				? ValidationResult.Success
				: new ValidationResult("You must be at least 18 years old.");
	}
}