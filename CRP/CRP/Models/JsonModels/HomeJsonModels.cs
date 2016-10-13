﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;

namespace CRP.Models.JsonModels
{
	// Model to map the search request
	// Use as input for route ~/api/vehicles/search/ of HomeController
	public class SearchConditionModel : VehicelFilterConditionModel
	{
		public int[] NumberOfSeatList { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public double? MaxPrice { get; set; }
		public double? MinPrice { get; set; }
	}

	// Returned json model for route ~/api/vehicles/search/ of HomeController
	public class SearchResultJsonModel : IVehicleFilterJsonModel
	{
		public List<SearchResultItemJsonModel> SearchResultList { get; set; }
		public int TotalResult { get; set; }
		public int TotalPage { get; set; }
		public double? LowestPrice { get; set; }
		public double? HighestPrice { get; set; }
		public double? AveragePrice { get; set; }
		
		public SearchResultJsonModel(List<SearchResultItemJsonModel> searchResultList, int totalResult)
		{
			SearchResultList = searchResultList;
			TotalResult = totalResult;
			TotalPage = (int)Math.Ceiling((float)totalResult / Constants.NumberOfSearchResultPerPage);
			LowestPrice = searchResultList.Min(r => r.BestPossibleRentalPrice);
			HighestPrice = searchResultList.Max(r => r.BestPossibleRentalPrice);
			AveragePrice = searchResultList.Average(r => r.BestPossibleRentalPrice);
		}
	}

	// Model of JSON object of search result for searching vehicle to book
	public class SearchResultItemJsonModel : VehicleRecordJsonModel
	{
		public List<string> ImageList { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public string BestPossibleRentalPeriod { get; set; }
		// Lowest price range of this vehicle that fit the filter
		public double? BestPossibleRentalPrice { get; set; }
		
		public SearchResultItemJsonModel(Entities.Vehicle vehicle, int rentalTime) : base(vehicle)
		{
			ID = vehicle.ID;
			Name = vehicle.Name;
			LicenseNumber = vehicle.LicenseNumber;

			ImageList = vehicle.VehicleImages.Select(i => i.URL).ToList();

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