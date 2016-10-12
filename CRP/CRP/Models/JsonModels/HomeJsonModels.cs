using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;

namespace CRP.Models.JsonModels
{
	// Model to map the search request
	// Use as input for route ~/api/vehicles/search/ of HomeController
	public class SearchConditionModel
	{
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public double? MaxPrice { get; set; }
		public double? MinPrice { get; set; }
		public int[] LocationIDList { get; set; }
		public int[] BrandIDList { get; set; }
		public int[] ModelIDList { get; set; }
		public int[] VehicleTypeList { get; set; }
		public int[] NumberOfSeatList { get; set; }
		public int[] TransmissionTypeIDList { get; set; }
		public int[] ColorIDList { get; set; }
		public int?[] FuelTypeIDList { get; set; }
		public string OrderBy { get; set; }
		public int Page { get; set; } = 1;
	}

	public class SearchResultJsonModel
	{
		public List<SearchResultVehicleJsonModel> SearchResultList { get; set; }
		public int TotalResult { get; set; }
		public int TotalPage { get; set; }
		public double? LowestPrice { get; set; }
		public double? HighestPrice { get; set; }
		public double? AveragePrice { get; set; }

		public SearchResultJsonModel(List<SearchResultVehicleJsonModel> searchResultList, int totalResult)
		{
			SearchResultList = searchResultList;
			TotalResult = totalResult;

			TotalPage = (int)Math.Ceiling((float) totalResult / Constants.NumberOfSearchResultPerPage);
			LowestPrice = searchResultList.Min(r => r.BestPossibleRentalPrice);
			HighestPrice = searchResultList.Max(r => r.BestPossibleRentalPrice);
			AveragePrice = searchResultList.Average(r => r.BestPossibleRentalPrice);
		}
	}

	// Model of JSON object of search result for searching vehicle to book
	// Use as json result for route ~/api/vehicles/search/ of HomeController
	public class SearchResultVehicleJsonModel
	{
		public int ID { get; set; }
		public string Name { get; set; }
		public string LicenseNumber { get; set; }
		public string TransmissionTypeName { get; set; }
		public string GarageName { get; set; }
		public string Location { get; set; }
		public decimal? Star { get; set; }
		public List<string> CategoryList { get; set; }
		public List<string> ImageList { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public string BestPossibleRentalPeriod { get; set; }
		// Lowest price range of this vehicle that fit the filter
		public double? BestPossibleRentalPrice { get; set; }
		
		public SearchResultVehicleJsonModel(Entities.Vehicle vehicle, int rentalTime)
		{
			ID = vehicle.ID;
			Name = vehicle.Name;
			LicenseNumber = vehicle.LicenseNumber;
			GarageName = vehicle.Garage.Name;
			Location = vehicle.Garage.Location.Name;
			Star = vehicle.Star;

			if (vehicle.Model.ModelCategoryMappings.Any())
			{
				CategoryList = new List<string>();

				foreach (ModelCategoryMapping categoryMapping in vehicle.Model.ModelCategoryMappings)
				{
					CategoryList.Add(categoryMapping.Category.Name);
				}
			}

			if (vehicle.VehicleImages.Any())
			{
				ImageList = new List<string>();

				foreach (VehicleImage image in vehicle.VehicleImages)
				{
					ImageList.Add(image.URL);
				}

			}

			string tempTransmissionTypeName = "";
			Constants.TransmissionType.TryGetValue(vehicle.TransmissionType, out tempTransmissionTypeName);
			TransmissionTypeName = tempTransmissionTypeName;

			// Find the best PriceGroupItem that match the search
			var items = vehicle.VehicleGroup.PriceGroup.PriceGroupItems.OrderBy(x => x.MaxTime);
			foreach (PriceGroupItem item in items)
			{
				if(item.MaxTime >= rentalTime)
				{
					BestPossibleRentalPeriod = item.MaxTime + (item.MaxTime == 1 ? " hour" : " hours");
					BestPossibleRentalPrice = item.Price;
					break;
				}
			}
			// If not found, use the PerDayPrice
			if(BestPossibleRentalPrice == null)
			{
				BestPossibleRentalPeriod = "day";
				BestPossibleRentalPrice = vehicle.VehicleGroup.PriceGroup.PerDayPrice;
			}
		}
	}
}