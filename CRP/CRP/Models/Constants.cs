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
		public const string TEST_MERCHANT_ID = "47990";//"36680";
		public const string TEST_MERCHANT_PASS = "2c91870ef1fc9e506d46c46fe61d3b08";//"matkhauketnoi"

		public const double BOOKING_FEE_PERCENTAGE = 0.05;

		// 10 mins
		public const int BOOKING_PENDING_PERIOD_IN_MILISEC = 1000*60*10;

		public const int NUM_OF_SEARCH_RESULT_PER_PAGE = 10;
		public const int SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR = 6;
		public const int SOONEST_POSSIBLE_BOOKING_END_TIME_FROM_NOW_IN_HOUR = 7;
		public const int LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY = 30;
		public static readonly int[] COMMON_NUM_OF_SEAT = new int[] { 2, 4, 5, 7, 8, 16 };
        public static int MIN_YEAR = 1988;
        public static int MAX_YEAR = DateTime.Now.Year;

		public class SortingOption
		{
			public string Name { get; set; }
			public string Description { get; set; }
			public bool IsDescending { get; set; }

			public SortingOption(string name, string description, bool isDescending)
			{
				Name = name; Description = description; IsDescending = isDescending;
			}
		}
		public static readonly List<SortingOption> ALLOWED_SORTING_PROPS_IN_SEARCH_PAGE = new List<SortingOption>
		{
			new SortingOption(nameof(SearchResultItemJsonModel.BestPossibleRentalPeriod), "Gói thời gian thuê xe phù hợp nhất", false),
			new SortingOption(nameof(SearchResultItemJsonModel.Star), "Xe có điểm đánh giá tốt nhất", true),
			new SortingOption(nameof(SearchResultItemJsonModel.NumOfComment), "Garage có điểm đánh giá tốt nhất", true),
			new SortingOption(nameof(SearchResultItemJsonModel.BestPossibleRentalPrice), "Giá từ thấp đến cao", false),
			new SortingOption(nameof(SearchResultItemJsonModel.BestPossibleRentalPrice), "Giá từ cao đến thấp", true),
			new SortingOption(nameof(SearchResultItemJsonModel.Year), "Xe từ mới đến cũ", true),
			new SortingOption(nameof(SearchResultItemJsonModel.Year), "Xe từ cũ đến mới", false),
		};

		public static readonly Dictionary<int, string> COLOR = new Dictionary<int, string>
		{
			{ 0, "--" },
			{ 1, "White" },
			{ 2, "Black" },
			{ 3, "Gray" },
			{ 4, "Brown" },
			{ 5, "Blue" },
			{ 6, "Red" },
			{ 7, "Green" },
			{ 8, "Yellow" },
			{ 9, "Orange" },
		};

		public static readonly Dictionary<int, string> FUEL_TYPE = new Dictionary<int, string>{
			{ 1, "Xăng" },
			{ 2, "Dầu Diesel" },
			{ 3, "Điện" },
			{ 4, "Điện hybrid" },
			{ 5, "Điện plug-in hybrid" },
		};

		public static readonly Dictionary<int, string> TRANSMISSION_TYPE = new Dictionary<int, string> {
			{ 1, "Số tự động" },
			{ 2, "Số sàn" }
		};
	}
}