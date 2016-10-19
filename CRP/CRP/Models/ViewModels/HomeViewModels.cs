using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;

namespace CRP.Models.ViewModels
{
	// Model to populate the filters in search page
	public class SearchPageViewModel
	{
		public List<Brand> BrandList { get; set; }
		public List<Category> CategoryList { get; set; }
		public List<Location> LocationList { get; set; }
		public double MaxPrice { get; set; }
		public double MinPrice { get; set; }
		public int MaxYear { get; set; }
		public int MinYear { get; set; }

		public SearchPageViewModel(List<Brand> brandList, List<Category> categoryList, List<Location> locationList, double maxPrice, double minPrice, int maxYear, int minYear)
		{
			BrandList = brandList;
			CategoryList = categoryList;
			LocationList = locationList;
			MaxPrice = maxPrice;
			MinPrice = minPrice;
			MaxYear = maxYear;
			MinYear = minYear;
		}
	}

	// Model to map the search request
	// Use as input for route ~/api/vehicles/search/ of HomeController
	public class SearchConditionModel
	{
		public int[] NumberOfSeatList { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public double? MaxPrice { get; set; }
		public double? MinPrice { get; set; }
		public int[] TransmissionTypeIDList { get; set; }
		public int[] ColorIDList { get; set; }
		public int?[] FuelTypeIDList { get; set; }
		public int? LocationID { get; set; }
		public int[] CategoryIDList { get; set; }
		public decimal? MaxVehicleRating { get; set; }
		public decimal? MinVehicleRating { get; set; }
		public decimal? MaxGarageRating { get; set; }
		public decimal? MinGarageRating { get; set; }
		public int? MaxProductionYear { get; set; }
		public int? MinProductionYear { get; set; }
		public int[] BrandIDList { get; set; } = new int[0];
		public int[] ModelIDList { get; set; } = new int[0];

		public string OrderBy { get; set; }
		public bool IsDescendingOrder { get; set; }
		public int Page { get; set; } = 1;
		public int RecordPerPage { get; set; } = Constants.NUM_OF_SEARCH_RESULT_PER_PAGE;
	}

	// Returned json model for route ~/api/vehicles/search/ of HomeController
	public class SearchResultJsonModel : IVehicleFilterJsonModel
	{
		public List<SearchResultItemJsonModel> SearchResultList { get; set; }
		public int CurrentPage { get; set; }
		public int TotalResult { get; set; }
		public int TotalPage { get; set; }
		public double? AveragePrice { get; set; }

		public SearchResultJsonModel(List<SearchResultItemJsonModel> searchResultList, double? averagePrice, int totalResult, int currentPage)
		{
			if (!searchResultList.Any()) return;

			SearchResultList = searchResultList;
			CurrentPage = currentPage;
			TotalResult = totalResult;
			TotalPage = (int)Math.Ceiling((float)totalResult / Constants.NUM_OF_SEARCH_RESULT_PER_PAGE);
			AveragePrice = averagePrice;
		}
	}

	// Model of JSON object of search result for searching vehicle to book
	public class SearchResultItemJsonModel : VehicleRecordJsonModel
	{
		public string Location { get; set; }
		public string GarageName { get; set; }
		public decimal GarageRating { get; set; }
		public string TransmissionTypeName { get; set; }
		public string FuelTypeName { get; set; }
		public List<string> CategoryList { get; set; }
		public List<string> ImageList { get; set; }
		public int NumOfComment { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public string BestPossibleRentalPeriod { get; set; }
		// Lowest price range of this vehicle that fit the filter
		public double BestPossibleRentalPrice { get; set; }

		public SearchResultItemJsonModel(Entities.Vehicle vehicle, int rentalTime) : base(vehicle)
		{
			Location = vehicle.Garage.Location.Name;
			GarageName = vehicle.Garage.Name;
			GarageRating = vehicle.Garage.Star;
			ImageList = vehicle.VehicleImages.Select(i => i.URL).ToList();
			NumOfComment = vehicle.BookingReceipts.Count(br => br.Comment != null);

			string tmpString = null;
			Constants.TRANSMISSION_TYPE.TryGetValue(vehicle.TransmissionType, out tmpString);
			TransmissionTypeName = tmpString;

			if (vehicle.FuelType != null)
			{
				tmpString = null;
				Constants.FUEL_TYPE.TryGetValue((int)vehicle.FuelType, out tmpString);
				FuelTypeName = tmpString;
			}

			// Find the best PriceGroupItem that match the search
			var items = vehicle.VehicleGroup.PriceGroup.PriceGroupItems.OrderBy(x => x.MaxTime);
			foreach (var item in items)
			{
				if (item.MaxTime >= rentalTime)
				{
					BestPossibleRentalPeriod = item.MaxTime + "&nbsp;giờ";
					BestPossibleRentalPrice = item.Price;
					break;
				}
			}
			// If not found, use the PerDayPrice
			if (BestPossibleRentalPrice == 0.0d)
			{
				BestPossibleRentalPeriod = "ngày";
				BestPossibleRentalPrice = vehicle.VehicleGroup.PriceGroup.PerDayPrice;
			}
		}
	}
}