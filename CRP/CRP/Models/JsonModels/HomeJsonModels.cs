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
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
		public int? LocationID { get; set; }
		public int? MaxPrice { get; set; }
		public int? MinPrice { get; set; }
		public int[] BrandIDList { get; set; }
		public int[] ModelIDList { get; set; }
		public int[] VehicleTypeList { get; set; }
		public int[] NumberOfDoorList { get; set; }
		public int[] TransmissionTypeIDList { get; set; }
		public int[] ColorIDList { get; set; }
		public int[] FuelTypeIDList { get; set; }
	}

	// Model of JSON object of search result for searching vehicle to book
	// Use as json result for route ~/api/vehicles/search/ of HomeController
	public class SearchResultJSONVModel
	{
		public int ID { get; set; }
		public string Name { get; set; }
		public string LicenseNumber { get; set; }
		public string TransmissionTypeName { get; set; }
		public string GarageName { get; set; }
		public string Location { get; set; }
		public int Star { get; set; }
		// Lowest price range of this vehicle that fit the filter
		public double BestPossibleRentalPrice { get; set; }
		// Shortest rental period of this vehicle that fit the filter
		public int BestPossibleRentalPeriod { get; set; }
		
		public SearchResultJSONVModel(Entities.Vehicle vehicle)
		{
			ID = vehicle.ID;
			Name = vehicle.Name;
			LicenseNumber = vehicle.LicenseNumber;
			GarageName = vehicle.Garage.Name;
			Location = vehicle.Garage.Location.Name;

			string tempTransmissionTypeName = "";
			Constants.TransmissionType.TryGetValue(vehicle.TransmissionType, out tempTransmissionTypeName);
			TransmissionTypeName = tempTransmissionTypeName;
		}
	}
}