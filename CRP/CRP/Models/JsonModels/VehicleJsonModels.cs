using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities;

namespace CRP.Models.JsonModels
{
	// Prototype for SearchConditionModel and VehicleManagementFilterCondition
	public abstract class VehicelFilterConditionModel
	{
		public int[] TransmissionTypeIDList { get; set; }
		public int[] ColorIDList { get; set; }
		public int?[] FuelTypeIDList { get; set; }
		public int[] LocationIDList { get; set; }
		public int[] CategoryIDList { get; set; }
		public int? MaxProductionYear { get; set; }
		public int? MinProductionYear { get; set; }
		public int[] BrandIDList { get; set; } = new int[0];
		public int[] ModelIDList { get; set; } = new int[0];
		public string OrderBy { get; set; }
		public bool IsDescendingOrder { get; set; }
		public int Page { get; set; } = 1;
	}

	public class VehicleManagementFilterConditionModel : VehicelFilterConditionModel
	{
		public string ProviderID { get; set; }
		public string LicenseNumber { get; set; }
		public string Name { get; set; }
		public int[] GarageIDList { get; set; }
		public int?[] VehicleGroupIDList { get; set; }
		public decimal? MaxRating { get; set; }
		public decimal? MinRating { get; set; }
	}

	public interface IVehicleFilterJsonModel { }

	public class VehicleDataTablesJsonModel : IVehicleFilterJsonModel
	{
		public List<VehicleManagementItemJsonModel> data { get; set; }
		public int recordsTotal { get; set; }
		public int recordsFiltered { get; set; }

		public VehicleDataTablesJsonModel(List<Vehicle> vehicleList, int totalRecords, int filteredRecords)
		{
			data = new List<VehicleManagementItemJsonModel>();
			foreach (Vehicle vehicle in vehicleList)
				data.Add(new VehicleManagementItemJsonModel(vehicle));

			recordsTotal = totalRecords;
			recordsFiltered = filteredRecords;
		}
	}

	public abstract class VehicleRecordJsonModel
	{
		public int ID { get; set; }
		public string LicenseNumber { get; set; }
		public string Name { get; set; }
		public int? Year { get; set; }
		public List<string> CategoryList { get; set; }
		public string GarageName { get; set; }
		public string Location { get; set; }
		public string TransmissionTypeName { get; set; }
		public string FuelTypeName { get; set; }
		public int NumOfSeat { get; set; }
		public decimal? Star { get; set; }

		public VehicleRecordJsonModel(Vehicle vehicle)
		{
			ID = vehicle.ID;
			LicenseNumber = vehicle.LicenseNumber;
			Name = vehicle.Name;
			Year = vehicle.Year;
			GarageName = vehicle.Garage.Name;
			Location = vehicle.Garage.Location.Name;
			NumOfSeat = vehicle.Model.NumOfSeat;
			Star = vehicle.Star;
			
			CategoryList = vehicle.Model.Categories.Select(c => c.Name).ToList();

			string tmpString = null;
			Constants.TransmissionType.TryGetValue(vehicle.TransmissionType, out tmpString);
			TransmissionTypeName = tmpString;

			if(vehicle.FuelType != null)
			{
				tmpString = null;
				Constants.FuelType.TryGetValue((int)vehicle.FuelType, out tmpString);
				FuelTypeName = tmpString;
			}
			
		}
	}

	public class VehicleManagementItemJsonModel : VehicleRecordJsonModel
	{
		public string ModelName { get; set; }
		public string BrandName { get; set; }
		public int GarageID { get; set; }
		public Nullable<int> VehicleGroupID { get; set; }
		public string VehicleGroupName { get; set; }

		public VehicleManagementItemJsonModel(Vehicle vehicle) : base(vehicle)
		{
			ModelName = vehicle.Model.Name;
			BrandName = vehicle.Model.Brand.Name;
			GarageID = vehicle.GarageID;
			VehicleGroupID = vehicle.VehicleGroupID;
			VehicleGroupName = vehicle.VehicleGroup.Name;
		}
	}
}