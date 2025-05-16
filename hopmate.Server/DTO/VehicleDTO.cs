using System.ComponentModel.DataAnnotations;

namespace hopmate.Server.DTO
{
	public class VehicleDTO
	{
		public Guid Id { get; set; }

		[Required]
		public string Brand { get; set; } = null!;

		[Required]
		public string Model { get; set; } = null!;

		[Required]
		public string Plate { get; set; } = null!;

		[Required]
		[Range(1, int.MaxValue, ErrorMessage = "Seats must be greater than 0")]
		public int Seats { get; set; }

		public string? ImageFilePath { get; set; }

		[Required]
		public Guid IdDriver { get; set; }

		[Required]
		public int IdColor { get; set; }

		// Simplified color information for display
		public string? ColorName { get; set; }

		// Simplified driver information for display
		public string? DriverName { get; set; }
	}

	public class CreateVehicleDTO
	{
		[Required]
		public string Brand { get; set; } = null!;

		[Required]
		public string Model { get; set; } = null!;

		[Required]
		public string Plate { get; set; } = null!;

		[Required]
		[Range(1, int.MaxValue, ErrorMessage = "Seats must be greater than 0")]
		public int Seats { get; set; }

		public string? ImageFilePath { get; set; }

		[Required]
		public Guid IdDriver { get; set; }

		[Required]
		public int IdColor { get; set; }
	}

	public class UpdateVehicleDTO
	{
		[Required]
		public string Brand { get; set; } = null!;

		[Required]
		public string Model { get; set; } = null!;

		[Required]
		public string Plate { get; set; } = null!;

		[Required]
		[Range(1, int.MaxValue, ErrorMessage = "Seats must be greater than 0")]
		public int Seats { get; set; }

		public string? ImageFilePath { get; set; }

		[Required]
		public int IdColor { get; set; }
	}
}