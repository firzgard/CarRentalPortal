using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Cryptography.Xml;
using CRP.Models.Entities;

namespace CRP.Models.ViewModels
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
		public int RecordPerPage { get; set; } = Constants.NUM_OF_SEARCH_RESULT_PER_PAGE;
	}

	// Model for containing vehicle datatables filtering conditions
	public class VehicleManagementFilterConditionModel : VehicelFilterConditionModel
	{
		public string ProviderID { get; set; }
		public string LicenseNumber { get; set; }
		public string Name { get; set; }
		public int[] GarageIDList { get; set; }
		public int?[] VehicleGroupIDList { get; set; }
		public decimal? MaxRating { get; set; }
		public decimal? MinRating { get; set; }

		public int Draw { get; set; }
	}

	public interface IVehicleFilterJsonModel { }

	public class VehicleDataTablesJsonModel : IVehicleFilterJsonModel
	{
		public List<VehicleManagementItemJsonModel> data { get; set; }
		public int draw { get; set; }
		public int recordsTotal { get; set; }
		public int recordsFiltered { get; set; }

		public VehicleDataTablesJsonModel(List<VehicleManagementItemJsonModel> vehicleList, int rDraw, int totalRecords, int filteredRecords)
		{
			data = vehicleList;
			draw = rDraw;
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
		public int NumOfSeat { get; set; }
		public decimal? Star { get; set; }

		protected VehicleRecordJsonModel(Vehicle vehicle)
		{
			ID = vehicle.ID;
			LicenseNumber = vehicle.LicenseNumber;
			Name = vehicle.Name;
			Year = vehicle.Year;
			NumOfSeat = vehicle.Model.NumOfSeat;
			Star = vehicle.Star;
		}
	}

	public class VehicleManagementItemJsonModel : VehicleRecordJsonModel
	{
		public string VehicleGroupName { get; set; }

		public VehicleManagementItemJsonModel(Vehicle vehicle) : base(vehicle)
		{
			VehicleGroupName = vehicle.VehicleGroup.Name;
		}
	}

	public class VehicleDetailInfoModel
	{
		public int ID { get; set; }
		public string LicenseNumber { get; set; }
		public string Name { get; set; }
		public int ModelID { get; set; }
		public string ModelName { get; set; }
		public int BrandID { get; set; }
		public string BrandName { get; set; }
		public int GarageID { get; set; }
		public string GarageName { get; set; }
		public int? VehicleGroupID { get; set; }
		public string VehicleGroupName { get; set; }
		public int TransmissionTypeID { get; set; }
		public string TransmissionTypeName { get; set; }
		public int? FuelTypeID { get; set; }
		public string FuelTypeName { get; set; }
		public int ColorID { get; set; }
		public string ColorName { get; set; }
		public decimal Star { get; set; }
		public int NumOfDoor { get; set; }
		public int NumOfSeat { get; set; }
		public int? Year { get; set; }
		public List<string> Category { get; set; }

		public VehicleDetailInfoModel(Vehicle vehicle)
		{
			this.ID = vehicle.ID;
			this.LicenseNumber = vehicle.LicenseNumber;
			this.Name = vehicle.Name;
			this.ModelID = vehicle.ModelID;
			this.ModelName = vehicle.Model.Name;
			this.BrandID = vehicle.Model.BrandID;
			this.BrandName = vehicle.Model.Brand.Name;
			this.GarageID = vehicle.GarageID;
			this.GarageName = vehicle.Garage.Name;
			this.VehicleGroupID = vehicle.VehicleGroupID;
			this.VehicleGroupName = vehicle.VehicleGroup.Name;

			this.TransmissionTypeID = vehicle.TransmissionType;
			string tmpString = null;
			Constants.TRANSMISSION_TYPE.TryGetValue(vehicle.TransmissionType, out tmpString);
			this.TransmissionTypeName = tmpString;

			this.FuelTypeID = vehicle.FuelType;
			if (vehicle.FuelType != null)
			{
				tmpString = null;
				Constants.FUEL_TYPE.TryGetValue((int)(vehicle.FuelType), out tmpString);
				this.FuelTypeName = tmpString;
			}

			this.ColorID = vehicle.Color;
			tmpString = null;
			Constants.COLOR.TryGetValue(vehicle.Color, out tmpString);
			this.ColorName = tmpString;

			this.Star = vehicle.Star;
			this.NumOfDoor = vehicle.Model.NumOfDoor;
			this.NumOfSeat = vehicle.Model.NumOfSeat;
			this.Year = vehicle.Year;
			this.Category = vehicle.Model.Categories.Aggregate(
				new List<string>(), (categories, mapping) => { categories.Add(mapping.Name); return categories; });
		}
	}

	public class VehicleCalendarModel
	{
		public int ID { get; set; }
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
	}
}