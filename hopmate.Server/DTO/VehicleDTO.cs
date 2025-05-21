namespace hopmate.Server.DTO
{
	public class VehicleDTO
	{
		public Guid Id { get; set; }
		public string Brand { get; set; } = string.Empty;
		public string Model { get; set; } = string.Empty;
		public string Plate { get; set; } = string.Empty;
		public int Seats { get; set; }
		public string ImageFilePath { get; set; } = string.Empty;

		public Guid IdDriver { get; set; }
		public int IdColor { get; set; }

		public string ColorName { get; set; } = string.Empty;
	}

	public class CreateVehicleDTO
	{
		public string Brand { get; set; } = string.Empty;
		public string Model { get; set; } = string.Empty;
		public string Plate { get; set; } = string.Empty;
		public int Seats { get; set; }
		public string ImageFilePath { get; set; } = string.Empty;

		public Guid IdDriver { get; set; }
		public int IdColor { get; set; }
	}

	public class UpdateVehicleDTO
	{
		public Guid Id { get; set; }
		public string Brand { get; set; } = string.Empty;
		public string Model { get; set; } = string.Empty;
		public string Plate { get; set; } = string.Empty;
		public int Seats { get; set; }
		public string ImageFilePath { get; set; } = string.Empty;

		public Guid IdDriver { get; set; }
		public int IdColor { get; set; }
	}
}
