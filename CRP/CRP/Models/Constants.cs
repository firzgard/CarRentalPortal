using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CRP.Models
{
	public class Constants
	{
		public static readonly int NumberOfSearchResultPerPage = 10;
		public static readonly int SoonestPossibleBookingStartTimeFromNowInHour = 6;
		public static readonly int SoonestPossibleBookingEndTimeFromNowInHour = 7;
		public static readonly int LatestPossibleBookingStartTimeFromNowInDay = 30;
		public static readonly int[] CommonNumOfSeat = new int[] { 2, 4, 7, 16, 29, 45 };

		public class SortingProp
		{
			public string Value { get; set; }
			public string Name { get; set; }

			public SortingProp(string value, string name) { Value = value; Name = name; }
		}

		public static readonly List<SortingProp> AllowedSortingPropsInSearchPage = new List<SortingProp>
		{
			new SortingProp("BestPossibleRentalPeriod", "Best Possible Rental Period"),
			new SortingProp("BestPossibleRentalPrice", "Best Possible Rental Price"),
			new SortingProp("Year", "Production Year"),
			new SortingProp("NumOfComment", "Number of Review"),
			new SortingProp("NumOfSeat", "Number of Seat"),
			new SortingProp("Star", "Rating")
		};

		public static readonly string[] AllowedSortingPropsInVehicleManagement = new string[]
		{
			"BrandName", "GarageName", "LicenseNumber", "Location", "ModelName", "Name", "NumOfSeat", "Star", "TransmissionTypeName", "VehicleGroupName", "Year"
		};

		public static readonly Dictionary<int, string> Color = new Dictionary<int, string>
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

		public static readonly Dictionary<int, string> FuelType = new Dictionary<int, string>{
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

		public static readonly Dictionary<int, string> TransmissionType = new Dictionary<int, string> {
			{ 1, "Automatic" },
			{ 2, "Manual" }
		};
	}
}