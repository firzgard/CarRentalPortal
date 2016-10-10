using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRP.Models.Entities.Repositories;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Models.Entities.Services
{
	public class VehicleService
	{
		VehicleRepository _repository = new VehicleRepository();
		public Boolean Add(Vehicle vehicle)
		{
			try
			{
				_repository.Add(vehicle);
			}
			catch (Exception e)
			{
				e.GetHashCode();
				return false;
			}
			return true;
		}

		public Boolean Delete(int ID)
		{
			Vehicle deleteVehicle = _repository.findById(ID);
			if (deleteVehicle == null)
			{
				return false;
			}
			else
			{
				try
				{
					_repository.Delete(deleteVehicle);
				}
				catch (Exception e)
				{
					e.GetHashCode();
					return false;
				}
				return true;
			}
		}

		public List<Vehicle> GetAll()
		{
			List<Vehicle> lstVehicle = new List<Vehicle>();
			lstVehicle = _repository.getAll();
			return lstVehicle;
		}
		public Boolean UpdateVehicle(Vehicle vehicle)
		{
			Vehicle sVehicle = _repository.findById(vehicle.ID);
			if (sVehicle == null)
			{
				return false;
			}
			try
			{
				_repository.Update(vehicle);
			}
			catch (Exception e)
			{
				e.GetBaseException();
				return false;
			}
			return true;
		}
		public Vehicle FindByID(int ID)
		{
			Vehicle vehilce = _repository.findById(ID);
			return vehilce;
		}

		public SearchResultJsonModel FindToBook(SearchConditionModel searchConditions)
		{
			// Get all vehicles
			List<Vehicle> vehicles = _repository.getAll();
			
			// Filters, go!!
			if (searchConditions.TransmissionTypeIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.TransmissionTypeIDList.Contains(v.TransmissionType)
				).ToList();

			if (searchConditions.NumberOfSeatList != null)
				vehicles = vehicles.Where(
					v => searchConditions.NumberOfSeatList.Contains(v.Model.NumOfSeat)
				).ToList();

			// First, use intersect() to join 2 array<int> that contain CategoryIDs
			// Then check if the array is empty or not
			if (searchConditions.VehicleTypeList != null)
				vehicles = vehicles.Where(
					v => {
						var vehicleCategoryList = v.Model.ModelCategoryMappings.Aggregate(
							new List<int>(), (acc, r) => { acc.Add(r.CategoryID); return acc; }
						);

						return searchConditions.VehicleTypeList.Intersect(vehicleCategoryList).Any();
					}
				).ToList();

			if (searchConditions.ColorIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.ColorIDList.Contains(v.Color)
				).ToList();

			if (searchConditions.FuelTypeIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.FuelTypeIDList.Contains(v.FuelType)
				).ToList();

			if (searchConditions.LocationIDList != null)
				vehicles = vehicles.Where(
					v => searchConditions.LocationIDList.Contains(v.Garage.LocationID))
				.ToList();

			if (searchConditions.BrandIDList != null || searchConditions.ModelIDList != null)
				vehicles = vehicles.Where(v => searchConditions.BrandIDList.Contains(v.Model.BrandID)
								|| searchConditions.ModelIDList.Contains(v.ModelID)).ToList();

			// Get the rental time in hour
			TimeSpan rentalTimeSpan = (DateTime)searchConditions.EndTime - (DateTime)searchConditions.StartTime;
			int rentalTime = (int)Math.Ceiling(rentalTimeSpan.TotalHours);

			vehicles = vehicles.Where(v => !(v.VehicleGroup.MaxRentalPeriod * 24 < rentalTime)).ToList();

			vehicles = vehicles.Where(v =>
			{
				bool isValid = true;
				foreach (BookingReceipt br in v.BookingReceipts)
				{
					if ((searchConditions.StartTime > br.StartTime
								&& searchConditions.StartTime < br.EndTime)
							|| (searchConditions.EndTime > br.StartTime
								&& searchConditions.EndTime < br.EndTime)
							|| (searchConditions.StartTime <= br.StartTime
								&& searchConditions.EndTime >= br.EndTime))
					{
						isValid = false;
						break;
					}
				}
				return isValid;
			}).ToList();

			// Parse into model suitable to send back to browser
			List<SearchResultVehicleJsonModel> results = new List<JsonModels.SearchResultVehicleJsonModel>();
			foreach(Vehicle vehicle in vehicles)
			{
				results.Add(new SearchResultVehicleJsonModel(vehicle, rentalTime));
			}

			if (searchConditions.MaxPrice != null && searchConditions.MinPrice != null
					&& searchConditions.MaxPrice > searchConditions.MinPrice)
			{
				results = results.Where(
					r => searchConditions.MaxPrice >= r.BestPossibleRentalPrice
						&& searchConditions.MinPrice <= r.BestPossibleRentalPrice
				).ToList();
			}

			// Paginate
			if ((searchConditions.Page - 1) * Constants.NumberOfSearchResultPerPage < results.Count)
				searchConditions.Page = 1;

			results = results.Skip((searchConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
					.Take(Constants.NumberOfSearchResultPerPage)
					.ToList();

			// Order
			System.Reflection.PropertyInfo info = typeof(SearchResultVehicleJsonModel).GetProperty(searchConditions.OrderBy);
			if (info != null)
				results = results.OrderBy(r => info.GetValue(r)).ToList();

			// Nest into result object
			return new SearchResultJsonModel(results, results.Count);
		}

        // filter with multi-conditions
        public List<VehicleModel> VehicleFilter(VehicleFilterCondition FilterConditions)
        {
            List<Vehicle> Vehicles = _repository.getAll();

            /// FILTER ///
            // VehicleGroupID
            if(FilterConditions.VehicleGroupIDList != null)
            {
                Vehicles = Vehicles.Where(v => FilterConditions.VehicleGroupIDList.Contains(v.VehicleGroupID)).ToList();
            }
            // GarageID
            if(FilterConditions.GarageIDList != null)
            {
                Vehicles = Vehicles.Where(v => FilterConditions.VehicleGroupIDList.Contains(v.GarageID)).ToList();
            }
            // License Number
            if(FilterConditions.LicenseNumber != null)
            {
                Vehicles = Vehicles.Where(v => v.LicenseNumber.Contains(FilterConditions.LicenseNumber)).ToList();
            }
            // Vehicle Name
            if(FilterConditions.Name != null)
            {
                Vehicles = Vehicles.Where(v => v.Name.Contains(FilterConditions.Name)).ToList();
            }
            // Category ?
            if(FilterConditions.CategoryIDList != null)
            {
                Vehicles = Vehicles.Where(v => {
                    var vehicleCategoryList = v.Model.ModelCategoryMappings.Aggregate(
                        new List<int>(), (acc, r) => { acc.Add(r.CategoryID); return acc; }
                    );

                    return FilterConditions.CategoryIDList.Intersect(vehicleCategoryList).Any();
                }).ToList();
            }
            // FuelType
            if(FilterConditions.FuelTypeIDList != null)
            {
                Vehicles = Vehicles.Where(v => FilterConditions.FuelTypeIDList.Contains(v.TransmissionType)).ToList();
            }
            // TransmissionType
            if(FilterConditions.TransmissionTypeIDList != null)
            {
                Vehicles = Vehicles.Where(v => FilterConditions.TransmissionTypeIDList.Contains(v.TransmissionType)).ToList();
            }
            // Number of seat
            if(FilterConditions.NumOfSeatFrom != null || FilterConditions.NumOfSeatTo != null)
            {
                if(FilterConditions.NumOfSeatFrom == null)
                {
                    FilterConditions.NumOfSeatFrom = 0;
                }
                if(FilterConditions.NumOfSeatTo == null)
                {
                    FilterConditions.NumOfSeatTo = 100;
                }

                Vehicles = Vehicles.Where(v => (v.Model.NumOfSeat >= FilterConditions.NumOfSeatFrom 
                && v.Model.NumOfSeat <= FilterConditions.NumOfSeatTo)).ToList();
            }
            // Rate
            if(FilterConditions.RateFrom != null || FilterConditions.RateTo != null)
            {
                if(FilterConditions.RateFrom == null)
                {
                    FilterConditions.RateFrom = 0.0m;
                }
                if(FilterConditions.RateTo == null)
                {
                    FilterConditions.RateTo = 5.0m;
                }

                Vehicles = Vehicles.Where(v => (v.Star >= FilterConditions.RateFrom && v.Star <= FilterConditions.RateTo)).ToList();
            }
            // Year
            if(FilterConditions.YearFrom != null || FilterConditions.YearTo != null)
            {
                if(FilterConditions.YearFrom == null)
                {
                    FilterConditions.RateFrom = 1900;
                }
                if(FilterConditions.YearTo == null)
                {
                    FilterConditions.RateTo = int.MaxValue;
                }

                Vehicles = Vehicles.Where(v => (v.Year >= FilterConditions.YearFrom && v.Year <= FilterConditions.YearTo)).ToList();
            }

            // parse to VehicleModel Jsonformat
            List<VehicleModel> VehicleJson = new List<VehicleModel>();

            foreach(Vehicle Vehicle in Vehicles)
            {
                VehicleJson.Add(new VehicleModel(Vehicle));
            }

            // paginate
            if ((FilterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage < VehicleJson.Count)
            {
                FilterConditions.Page = 1;
            }

            VehicleJson = VehicleJson.Skip((FilterConditions.Page - 1) * Constants.NumberOfSearchResultPerPage)
                    .Take(Constants.NumberOfSearchResultPerPage)
                    .ToList();

            // OderBy Ascending or Descending


            return VehicleJson;
        }
	}
}