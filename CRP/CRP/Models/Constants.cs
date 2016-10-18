using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using CRP.Models.ViewModels;

namespace CRP.Models
{
	public class Constants
	{
		public const int NUM_OF_SEARCH_RESULT_PER_PAGE = 10;
		public const int SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR = 6;
		public const int SOONEST_POSSIBLE_BOOKING_END_TIME_FROM_NOW_IN_HOUR = 7;
		public const int LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY = 30;
		public static readonly int[] COMMON_NUM_OF_SEAT = new int[] { 2, 4, 5, 7, 8, 16 };

		public static readonly Dictionary<string, string> ALLOWED_SORTING_PROPS_IN_SEARCH_PAGE = new Dictionary<string, string>
		{
			{ nameof(SearchResultItemJsonModel.BestPossibleRentalPeriod), "Best Possible Rental Period" },
			{ nameof(SearchResultItemJsonModel.BestPossibleRentalPrice), "Best Possible Rental Price" },
			{ nameof(SearchResultItemJsonModel.Year), "Production Year" },
			{ nameof(SearchResultItemJsonModel.NumOfComment), "Number of Review" },
			{ nameof(SearchResultItemJsonModel.NumOfSeat), "Number of Seat" },
			{ nameof(SearchResultItemJsonModel.Star), "Rating" }
		};

		public static readonly Dictionary<int, string> COLOR = new Dictionary<int, string>
		{
			{ 0, "Another color" },
			{ 1, "Black" },
			{ 2, "Blue" },
			{ 3, "Brown" },
			{ 4, "Green" },
			{ 5, "Orange" },
			{ 6, "Purple" },
			{ 7, "Red" },
			{ 8, "Silver" },
			{ 9, "White" },
			{ 10, "Yellow" }
		};

		public static readonly Dictionary<int, string> FUEL_TYPE = new Dictionary<int, string>{
			{ 1, "Diesel" },
			{ 2, "Electric" },
			{ 3, "Hybrid Electric" },
			{ 4, "Petrol" },
			{ 5, "Plug-in Hybrid Electric" },
		};

		public static readonly Dictionary<int, string> TRANSMISSION_TYPE = new Dictionary<int, string> {
			{ 1, "Automatic" },
			{ 2, "Manual" }
		};
	}
}