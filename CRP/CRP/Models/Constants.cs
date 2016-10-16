using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models
{
	public class Constants
	{
		public const int NUM_OF_SEARCH_RESULT_PER_PAGE = 10;
		public const int SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR = 6;
		public const int SOONEST_POSSIBLE_BOOKING_END_TIME_FROM_NOW_IN_HOUR = 7;
		public const int LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY = 30;
		public static readonly int[] COMMON_NUM_OF_SEAT = new int[] { 2, 4, 7, 16, 29, 45 };

		public class SortingProp
		{
			public string Value { get; set; }
			public string Name { get; set; }

			public SortingProp(string value, string name) { Value = value; Name = name; }
		}

		public static readonly List<SortingProp> ALLOWED_SORTING_PROPS_IN_SEARCH_PAGE = new List<SortingProp>
		{
			new SortingProp("BestPossibleRentalPeriod", "Best Possible Rental Period"),
			new SortingProp("BestPossibleRentalPrice", "Best Possible Rental Price"),
			new SortingProp("Year", "Production Year"),
			new SortingProp("NumOfComment", "Number of Review"),
			new SortingProp("NumOfSeat", "Number of Seat"),
			new SortingProp("Star", "Rating")
		};
		
		public static readonly string[] ALLOWED_SORTING_PROPS_IN_VEHICLE_MANAGEMENT = new string[]
		{
			"BrandName", "GarageName", "LicenseNumber", "Location", "ModelName", "Name", "NumOfSeat", "Star", "TransmissionTypeName", "VehicleGroupName", "Year"
		};

		public static readonly Dictionary<int, string> COLOR = new Dictionary<int, string>
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

		public static readonly Dictionary<int, string> FUEL_TYPE = new Dictionary<int, string>{
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

		public static readonly Dictionary<int, string> TRANSMISSION_TYPE = new Dictionary<int, string> {
			{ 1, "Automatic" },
			{ 2, "Manual" }
		};
	}
}