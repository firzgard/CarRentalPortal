using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models
{
	public class Constants
	{
		public readonly static Dictionary<int, string> TransmissionType = new Dictionary<int, string> {
			{ 1, "Automatic" },
			{ 2, "Manual" }
		};

		public readonly static Dictionary<int, string> FuelType = new Dictionary<int, string>{
			{ 1, "Amonia" },
			{ 2, "Bioalcohol" },
			{ 3, "Biodiesel" },
			{ 4, "Biogas" },
			{ 5, "Compressed Natural Gas" },
			{ 6, "Diesel" },
			{ 7, "Electric" },
			{ 8, "Flexible" },
			{ 9, "Hybrid Electric" },
			{ 10, "Hydrogen" },
			{ 11, "Liquefied Natural Gas" },
			{ 12, "Liquefied Petronleum Gas" },
			{ 13, "Petrol" },
			{ 14, "Plug-in Hybrid Electric" },
			{ 15, "Stream Wood Gas" }
		};

		public readonly static Dictionary<int, string> Color = new Dictionary<int, string>
		{
			{ 0, "Another color" },
			{ 1, "Beige" },
			{ 2, "Black" },
			{ 3, "Blue" },
			{ 4, "Brown" },
			{ 5, "Green" },
			{ 6, "Orange" },
			{ 7, "Purple" },
			{ 8, "Red" },
			{ 9, "Silver" },
			{ 10, "White" },
			{ 11, "Yellow" }
		};

		public readonly static Dictionary<int, string> VehicleType = new Dictionary<int, string>
		{
			{ 1, "Micro Car" },
			{ 2, "Minivan" },
			{ 3, "Pickup Truck" },
			{ 4, "Station Wagon" },
			{ 5, "Sedan" },
			{ 6, "SUV" },
		};

		public readonly static int[] CommonNumOfSeat = new int[] { 2, 4, 7, 16, 29, 45 };

		public readonly static int NumberOfSearchResultPerPage = 10;
	}
}